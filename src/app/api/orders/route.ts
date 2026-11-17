import { NextResponse } from 'next/server'
import { generateOrderNumber } from '@/lib/utils'

// In-memory orders for the demo session
const orders: Array<{
  id: string
  order_number: string
  items: unknown[]
  total_amount: number
  status: string
  created_at: string
}> = []

// GET /api/orders
export async function GET() {
  return NextResponse.json({
    data: orders,
    message: 'Orders fetched successfully',
  })
}

// POST /api/orders
export async function POST(request: Request) {
  try {
    const body = await request.json()

    if (!body.items || body.items.length === 0) {
      return NextResponse.json({ error: 'Order must have items' }, { status: 400 })
    }

    const newOrder = {
      id: `ord-${Date.now()}`,
      order_number: generateOrderNumber(),
      customer_id: body.customer_id || 'guest',
      items: body.items,
      total_amount: body.total_amount,
      shipping_cost: body.shipping_cost || 0,
      payment_method: body.payment_method,
      status: 'pending',
      payment_status: 'pending',
      created_at: new Date().toISOString(),
    }

    orders.push(newOrder)

    return NextResponse.json(
      { data: newOrder, message: 'Order created successfully' },
      { status: 201 }
    )
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
