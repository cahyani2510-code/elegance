'use client'

import { useState } from 'react'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Heart, ShoppingBag, Share2, Star, ChevronRight, Truck, RotateCcw, Shield, Minus, Plus, Check } from 'lucide-react'
import { mockProducts, mockReviews } from '@/data/mock'
import { useCartStore, useWishlistStore } from '@/store'
import { formatPrice, getDiscountPercentage, formatDate, cn } from '@/lib/utils'
import ProductCard from '@/components/product/ProductCard'
import toast from 'react-hot-toast'

export default function ProductDetailContent({ slug }: { slug: string }) {
  const product = mockProducts.find(p => p.slug === slug)

  if (!product) return notFound()

  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [selectedColor, setSelectedColor] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [addingToCart, setAddingToCart] = useState(false)
  const [activeTab, setActiveTab] = useState<'description' | 'reviews' | 'shipping'>('description')

  const addItem = useCartStore((s) => s.addItem)
  const { isInWishlist, toggleItem } = useWishlistStore()
  const inWishlist = isInWishlist(product.id)

  // Get unique sizes and colors from variants
  const sizes = [...new Set(product.variants?.map(v => v.size).filter(Boolean))] as string[]
  const colors = [...new Map(product.variants?.filter(v => v.color).map(v => [v.color, { name: v.color!, hex: v.color_hex || '#000' }]) || []).values()]

  const selectedVariant = product.variants?.find(v =>
    (!selectedSize || v.size === selectedSize) &&
    (!selectedColor || v.color === selectedColor)
  )

  const isInStock = selectedVariant ? selectedVariant.stock > 0 : product.stock > 0
  const availableStock = selectedVariant?.stock || product.stock
  const discount = getDiscountPercentage(product.original_price || 0, product.price)

  const handleAddToCart = async () => {
    if (sizes.length > 0 && !selectedSize) {
      toast.error('Please select a size', { style: { background: '#111', color: '#fff' } })
      return
    }
    if (colors.length > 0 && !selectedColor) {
      toast.error('Please select a color', { style: { background: '#111', color: '#fff' } })
      return
    }
    setAddingToCart(true)
    addItem(product, selectedVariant, quantity)
    toast.success(`${product.name} added to cart!`, {
      style: { background: '#111111', color: '#fff', border: '1px solid #C6A66B' },
      iconTheme: { primary: '#C6A66B', secondary: '#111111' },
    })
    await new Promise(r => setTimeout(r, 600))
    setAddingToCart(false)
  }

  const handleWishlist = () => {
    toggleItem(product)
    toast(inWishlist ? 'Removed from wishlist' : 'Added to wishlist!', {
      icon: inWishlist ? '💔' : '❤️',
      style: { background: '#111', color: '#fff' },
    })
  }

  const relatedProducts = mockProducts
    .filter(p => p.id !== product.id && p.category_id === product.category_id)
    .slice(0, 4)

  const reviews = mockReviews.filter(r => r.product_id === product.id)

  return (
    <div className="min-h-screen bg-[#F8F7F4]">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-[#e5e1d8]">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-16 py-3">
          <nav className="flex items-center gap-2 text-xs text-[#6b7280]">
            <Link href="/" className="hover:text-[#C6A66B] transition-colors">Home</Link>
            <ChevronRight size={12} />
            <Link href="/products" className="hover:text-[#C6A66B] transition-colors">Products</Link>
            <ChevronRight size={12} />
            <span className="text-[#111111] font-medium line-clamp-1">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-16 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Images */}
          <div className="flex flex-col-reverse md:flex-row gap-4">
            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-y-auto md:max-h-[600px]">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImageIndex(i)}
                    className={cn(
                      'flex-shrink-0 relative w-16 h-20 md:w-20 md:h-24 overflow-hidden border-2 transition-all duration-200',
                      i === selectedImageIndex ? 'border-[#C6A66B]' : 'border-transparent hover:border-[#C6A66B]/50'
                    )}
                  >
                    <Image src={img} alt={`${product.name} ${i + 1}`} fill className="object-cover" sizes="80px" />
                  </button>
                ))}
              </div>
            )}

            {/* Main Image */}
            <div className="flex-1 relative aspect-[3/4] overflow-hidden bg-[#f0ede8]">
              {product.images[selectedImageIndex] && (
                <Image
                  src={product.images[selectedImageIndex]}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              )}
              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {discount > 0 && (
                  <span className="bg-[#111111] text-[#C6A66B] text-xs font-bold tracking-wider px-3 py-1.5 uppercase">
                    -{discount}%
                  </span>
                )}
                {availableStock <= 5 && availableStock > 0 && (
                  <span className="bg-red-600 text-white text-xs font-bold tracking-wider px-3 py-1.5 uppercase">
                    Only {availableStock} left
                  </span>
                )}
              </div>

              {/* Wishlist */}
              <button
                onClick={handleWishlist}
                className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors"
              >
                <Heart
                  size={18}
                  className={cn('transition-colors', inWishlist ? 'fill-[#C6A66B] text-[#C6A66B]' : 'text-[#111111]')}
                />
              </button>
            </div>
          </div>

          {/* Product Info */}
          <div>
            {/* Brand & Name */}
            <Link href={`/brands/${product.brand?.slug}`} className="text-[#C6A66B] text-xs tracking-widest uppercase font-light hover:text-[#a8873d] transition-colors mb-2 block">
              {product.brand?.name}
            </Link>
            <h1 className="font-serif text-2xl md:text-3xl lg:text-4xl text-[#111111] mb-3 leading-tight">
              {product.name}
            </h1>

            {/* Rating & Reviews */}
            <div className="flex items-center gap-4 mb-5">
              <div className="flex items-center gap-1.5">
                <div className="flex">
                  {[1,2,3,4,5].map(s => (
                    <Star key={s} size={14} fill={s <= Math.round(product.rating) ? '#C6A66B' : 'none'} className={s <= Math.round(product.rating) ? 'text-[#C6A66B]' : 'text-[#d1cec8]'} />
                  ))}
                </div>
                <span className="text-sm font-medium text-[#111111]">{product.rating}</span>
              </div>
              <span className="text-sm text-[#6b7280] font-light">({product.review_count} reviews)</span>
              <span className="text-sm text-[#6b7280] font-light">{product.sold_count} sold</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6">
              <span className="font-serif text-3xl text-[#111111] font-medium">{formatPrice(product.price)}</span>
              {product.original_price && product.original_price > product.price && (
                <span className="text-lg text-[#6b7280] line-through font-light">{formatPrice(product.original_price)}</span>
              )}
              {discount > 0 && (
                <span className="bg-[#C6A66B]/10 text-[#C6A66B] text-sm font-semibold px-2 py-0.5">
                  Save {formatPrice(product.original_price! - product.price)}
                </span>
              )}
            </div>

            {/* Color Selection */}
            {colors.length > 0 && (
              <div className="mb-5">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-sm font-medium text-[#111111] tracking-wider uppercase">
                    Color {selectedColor && <span className="font-light text-[#6b7280] normal-case">— {selectedColor}</span>}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {colors.map(color => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color.name)}
                      title={color.name}
                      className={cn(
                        'w-8 h-8 rounded-full border-2 transition-all duration-200',
                        selectedColor === color.name
                          ? 'border-[#C6A66B] scale-110'
                          : 'border-transparent hover:border-[#C6A66B]/50'
                      )}
                      style={{ backgroundColor: color.hex, boxShadow: color.hex === '#FFFFFF' || color.hex === '#ffffff' ? 'inset 0 0 0 1px #e5e1d8' : 'none' }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Size Selection */}
            {sizes.length > 0 && (
              <div className="mb-5">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-sm font-medium text-[#111111] tracking-wider uppercase">Size</span>
                  <Link href="/size-guide" className="text-xs text-[#C6A66B] hover:underline font-light">Size Guide</Link>
                </div>
                <div className="flex flex-wrap gap-2">
                  {sizes.map(size => {
                    const variantForSize = product.variants?.find(v => v.size === size && (!selectedColor || v.color === selectedColor))
                    const isAvailable = variantForSize ? variantForSize.stock > 0 : true
                    return (
                      <button
                        key={size}
                        onClick={() => isAvailable && setSelectedSize(size)}
                        disabled={!isAvailable}
                        className={cn(
                          'min-w-[48px] h-10 px-3 border text-sm font-medium transition-all duration-200',
                          !isAvailable
                            ? 'border-[#e5e1d8] text-[#d1cec8] cursor-not-allowed line-through'
                            : selectedSize === size
                            ? 'border-[#111111] bg-[#111111] text-white'
                            : 'border-[#e5e1d8] text-[#111111] hover:border-[#111111]'
                        )}
                      >
                        {size}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mb-6">
              <span className="text-sm font-medium text-[#111111] tracking-wider uppercase mb-2.5 block">Quantity</span>
              <div className="flex items-center gap-0 border border-[#e5e1d8] w-fit">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 flex items-center justify-center hover:bg-[#f0ede8] transition-colors"
                >
                  <Minus size={14} />
                </button>
                <span className="w-12 text-center text-sm font-medium border-x border-[#e5e1d8]">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(availableStock, quantity + 1))}
                  className="w-10 h-10 flex items-center justify-center hover:bg-[#f0ede8] transition-colors"
                >
                  <Plus size={14} />
                </button>
              </div>
              {availableStock <= 10 && (
                <p className="text-xs text-red-500 mt-1.5">{availableStock} items left in stock</p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mb-6">
              <button
                onClick={handleAddToCart}
                disabled={addingToCart || !isInStock}
                className={cn(
                  'flex-1 py-4 flex items-center justify-center gap-2 text-xs font-semibold tracking-widest uppercase transition-all duration-200',
                  !isInStock
                    ? 'bg-[#e5e1d8] text-[#6b7280] cursor-not-allowed'
                    : 'btn-gold'
                )}
              >
                {addingToCart ? (
                  <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                ) : (
                  <ShoppingBag size={16} />
                )}
                {!isInStock ? 'Out of Stock' : addingToCart ? 'Adding...' : 'Add to Cart'}
              </button>
              <button
                onClick={handleWishlist}
                className="w-14 border border-[#e5e1d8] flex items-center justify-center hover:border-[#C6A66B] transition-colors"
              >
                <Heart
                  size={18}
                  className={cn(inWishlist ? 'fill-[#C6A66B] text-[#C6A66B]' : 'text-[#111111]')}
                />
              </button>
              <button
                onClick={() => {
                  navigator.clipboard?.writeText(window.location.href)
                  toast('Link copied!', { icon: '🔗', style: { background: '#111', color: '#fff' } })
                }}
                className="w-14 border border-[#e5e1d8] flex items-center justify-center hover:border-[#C6A66B] transition-colors"
              >
                <Share2 size={18} className="text-[#111111]" />
              </button>
            </div>

            {/* Features */}
            <div className="border-y border-[#e5e1d8] py-5 space-y-3">
              {[
                { icon: Truck, text: 'Free shipping on orders above Rp 500.000' },
                { icon: RotateCcw, text: '30-day hassle-free returns' },
                { icon: Shield, text: '100% authentic guaranteed' },
                { icon: Check, text: `In stock — ${availableStock} units available` },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3">
                  <Icon size={15} className="text-[#C6A66B] flex-shrink-0" />
                  <span className="text-sm text-[#6b7280] font-light">{text}</span>
                </div>
              ))}
            </div>

            {/* Seller Info */}
            {product.seller && (
              <div className="flex items-center gap-3 mt-5 p-4 bg-white border border-[#e5e1d8]">
                <div className="w-10 h-10 bg-[#f0ede8] rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="font-serif text-[#C6A66B] font-bold">
                    {product.seller.store_name.charAt(0)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-[#111111] truncate">{product.seller.store_name}</p>
                    {product.seller.is_verified && (
                      <span className="bg-[#C6A66B]/10 text-[#C6A66B] text-[10px] font-semibold px-1.5 py-0.5">✓ Verified</span>
                    )}
                  </div>
                  <p className="text-xs text-[#6b7280] font-light">{product.seller.city} · ⭐ {product.seller.rating} ({product.seller.review_count} reviews)</p>
                </div>
                <Link href={`/sellers/${product.seller.store_slug}`} className="text-xs text-[#C6A66B] hover:underline font-medium flex-shrink-0">
                  Visit Store
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Tabs: Description, Reviews, Shipping */}
        <div className="mt-12 md:mt-16">
          <div className="border-b border-[#e5e1d8] flex gap-6 md:gap-10">
            {(['description', 'reviews', 'shipping'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  'pb-4 text-sm tracking-wider uppercase font-light capitalize relative transition-colors',
                  activeTab === tab
                    ? 'text-[#111111] font-medium'
                    : 'text-[#6b7280] hover:text-[#111111]'
                )}
              >
                {tab === 'reviews' ? `Reviews (${reviews.length})` : tab}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-gold" />
                )}
              </button>
            ))}
          </div>

          <div className="py-8 bg-white p-6 md:p-8">
            {activeTab === 'description' && (
              <div className="max-w-2xl">
                <p className="text-[#111111]/80 font-light leading-relaxed mb-6">{product.description}</p>
                <div className="space-y-2">
                  <h4 className="font-medium text-[#111111] text-sm uppercase tracking-wider mb-3">Product Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {product.tags.map(tag => (
                      <span key={tag} className="border border-[#e5e1d8] text-xs text-[#6b7280] px-3 py-1 capitalize">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="max-w-2xl">
                {reviews.length === 0 ? (
                  <p className="text-[#6b7280] font-light">No reviews yet. Be the first to review this product!</p>
                ) : (
                  <div className="space-y-6">
                    {reviews.map(review => (
                      <div key={review.id} className="border-b border-[#e5e1d8] pb-6">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-medium text-sm text-[#111111]">{review.user?.full_name}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="flex">
                                {[1,2,3,4,5].map(s => (
                                  <Star key={s} size={12} fill={s <= review.rating ? '#C6A66B' : 'none'} className={s <= review.rating ? 'text-[#C6A66B]' : 'text-[#d1cec8]'} />
                                ))}
                              </div>
                              {review.is_verified && (
                                <span className="text-xs text-[#16a34a] font-medium">✓ Verified Purchase</span>
                              )}
                            </div>
                          </div>
                          <span className="text-xs text-[#6b7280] font-light">{formatDate(review.created_at)}</span>
                        </div>
                        <p className="text-sm text-[#6b7280] font-light leading-relaxed">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'shipping' && (
              <div className="max-w-2xl space-y-5">
                {[
                  { title: 'Standard Shipping (JNE REG)', desc: '3-5 business days · Rp 15.000 – 25.000 · Free above Rp 500.000' },
                  { title: 'Express Shipping (JNE YES)', desc: '1-2 business days · Rp 25.000 – 45.000' },
                  { title: 'Same Day Delivery', desc: 'Available in selected cities · Rp 50.000 – 75.000' },
                  { title: 'Returns & Exchanges', desc: 'Free returns within 30 days. Items must be unworn with original tags attached.' },
                ].map(({ title, desc }) => (
                  <div key={title} className="flex gap-4">
                    <div className="w-1 h-auto bg-[#C6A66B] flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-sm text-[#111111] mb-1">{title}</h4>
                      <p className="text-sm text-[#6b7280] font-light">{desc}</p>
                    </div>
                  </div>
                ))}
                <div className="p-4 bg-[#f8f7f4] border border-[#e5e1d8]">
                  <p className="text-xs text-[#6b7280] font-light">
                    <strong className="text-[#111111]">Note:</strong> Shipping rates and delivery times are estimates. Final rates calculated at checkout using real-time data from our shipping partners.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-12 md:mt-16">
            <h2 className="font-serif text-2xl md:text-3xl text-[#111111] mb-8">You May Also Like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {relatedProducts.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
