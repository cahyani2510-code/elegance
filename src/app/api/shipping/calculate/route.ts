import { NextResponse } from 'next/server'

// POST /api/shipping/calculate
// Architecture ready for RajaOngkir Starter/Pro API or Biteship API
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { origin = '153', destination, weight = 1000 } = body

    // SIMULATION MODE
    // In production, call:
    // https://api.rajaongkir.com/starter/cost
    // Headers: { key: process.env.RAJAONGKIR_API_KEY }

    const options = [
      {
        courier: 'JNE',
        service: 'REG',
        description: 'Layanan Reguler',
        cost: Math.round(18000 + (weight / 1000) * 4000),
        etd: '2-3 HARI',
      },
      {
        courier: 'JNE',
        service: 'YES',
        description: 'Yakin Esok Sampai',
        cost: Math.round(32000 + (weight / 1000) * 8000),
        etd: '1 HARI',
      },
      {
        courier: 'SiCepat',
        service: 'SIUNT',
        description: 'SiUntung',
        cost: Math.round(16000 + (weight / 1000) * 4000),
        etd: '2-3 HARI',
      },
      {
        courier: 'SiCepat',
        service: 'BEST',
        description: 'Besok Sampai Tujuan',
        cost: Math.round(28000 + (weight / 1000) * 7000),
        etd: '1 HARI',
      },
    ]

    return NextResponse.json({
      is_simulation: true,
      notice: 'SIMULATED SHIPPING RATES. Connect RAJAONGKIR_API_KEY for live calculation.',
      origin,
      destination: destination || 'Jakarta Selatan',
      weight,
      results: options,
    })
  } catch {
    return NextResponse.json({ error: 'Shipping calculation error' }, { status: 500 })
  }
}
