import { NextResponse } from 'next/server'

// POST /api/payments/simulate
// Architecture ready for Midtrans Snap API or Xendit Invoice API
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { order_id, amount, payment_method } = body

    if (!order_id || !amount || !payment_method) {
      return NextResponse.json(
        { error: 'Missing required payment parameters' },
        { status: 400 }
      )
    }

    // SIMULATION MODE
    // To connect real Midtrans:
    // const midtrans = new midtransClient.Snap({
    //   isProduction: false,
    //   serverKey: process.env.MIDTRANS_SERVER_KEY,
    //   clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY,
    // })

    const simulationResponse = {
      is_simulation: true,
      notice: 'SIMULATED TRANSACTION. No actual money was charged. Connect Midtrans / Xendit API keys to enable live payments.',
      transaction_id: `SIM-TRX-${Date.now()}`,
      order_id,
      gross_amount: amount,
      payment_type: payment_method,
      transaction_status: 'pending',
      virtual_account: payment_method.includes('va')
        ? `8808${Math.floor(1000000000 + Math.random() * 9000000000)}`
        : null,
      qr_string: payment_method === 'qris'
        ? `00020101021226540014ID.LINKAJA.WWW0118936009110022206497021500000000000000051440014ID.CO.QRIS.WWW0215000000000000000520454995303360540`
        : null,
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    }

    return NextResponse.json(simulationResponse)
  } catch {
    return NextResponse.json({ error: 'Payment simulation error' }, { status: 500 })
  }
}
