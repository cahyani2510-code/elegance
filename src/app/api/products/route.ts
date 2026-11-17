import { NextResponse } from 'next/server'
import { mockProducts } from '@/data/mock'

// GET /api/products
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category')
  const brand = searchParams.get('brand')
  const search = searchParams.get('search')
  const minPrice = searchParams.get('min_price')
  const maxPrice = searchParams.get('max_price')
  const sort = searchParams.get('sort') || 'newest'

  let filtered = [...mockProducts]

  if (category) {
    filtered = filtered.filter(p => p.category?.slug === category || p.category_id === category)
  }

  if (brand) {
    filtered = filtered.filter(p => p.brand?.slug === brand)
  }

  if (search) {
    const q = search.toLowerCase()
    filtered = filtered.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.tags.some(t => t.includes(q))
    )
  }

  if (minPrice) {
    filtered = filtered.filter(p => p.price >= Number(minPrice))
  }

  if (maxPrice) {
    filtered = filtered.filter(p => p.price <= Number(maxPrice))
  }

  switch (sort) {
    case 'price_asc': filtered.sort((a, b) => a.price - b.price); break
    case 'price_desc': filtered.sort((a, b) => b.price - a.price); break
    case 'popular': filtered.sort((a, b) => b.sold_count - a.sold_count); break
    case 'rating': filtered.sort((a, b) => b.rating - a.rating); break
    default: filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
  }

  return NextResponse.json({
    data: filtered,
    total: filtered.length,
    message: 'Products fetched successfully',
  })
}

// POST /api/products (Requires seller authentication)
export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Basic validation
    if (!body.name || !body.price || !body.category_id) {
      return NextResponse.json(
        { error: 'Name, price, and category are required' },
        { status: 400 }
      )
    }

    const newProduct = {
      id: `p-${Date.now()}`,
      seller_id: body.seller_id || '1',
      category_id: body.category_id,
      brand_id: body.brand_id,
      name: body.name,
      slug: body.slug || body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: body.description || '',
      price: Number(body.price),
      original_price: body.original_price ? Number(body.original_price) : undefined,
      stock: Number(body.stock || 0),
      is_featured: false,
      is_active: true,
      images: body.images || ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800'],
      tags: body.tags || [],
      rating: 0,
      review_count: 0,
      sold_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    return NextResponse.json(
      { data: newProduct, message: 'Product created successfully' },
      { status: 201 }
    )
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
