'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Heart, ShoppingBag, Star, Eye } from 'lucide-react'
import { Product } from '@/types'
import { formatPrice, getDiscountPercentage, cn } from '@/lib/utils'
import { useCartStore, useWishlistStore } from '@/store'
import toast from 'react-hot-toast'

interface ProductCardProps {
  product: Product
  variant?: 'default' | 'compact' | 'horizontal'
}

export default function ProductCard({ product, variant = 'default' }: ProductCardProps) {
  const [imageIndex, setImageIndex] = useState(0)
  const [addingToCart, setAddingToCart] = useState(false)

  const addItem = useCartStore((s) => s.addItem)
  const { isInWishlist, toggleItem } = useWishlistStore()

  const inWishlist = isInWishlist(product.id)
  const discount = getDiscountPercentage(product.original_price || 0, product.price)
  const isNew = new Date(product.created_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setAddingToCart(true)
    // Add first available variant or no variant
    addItem(product, product.variants?.[0])
    toast.success('Added to cart!', {
      style: { background: '#111111', color: '#fff', border: '1px solid #C6A66B' },
      iconTheme: { primary: '#C6A66B', secondary: '#111111' },
    })
    await new Promise(r => setTimeout(r, 600))
    setAddingToCart(false)
  }

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggleItem(product)
    toast(inWishlist ? 'Removed from wishlist' : 'Added to wishlist!', {
      icon: inWishlist ? '💔' : '❤️',
      style: { background: '#111111', color: '#fff' },
    })
  }

  if (variant === 'horizontal') {
    return (
      <Link href={`/products/${product.slug}`} className="flex gap-4 bg-white border border-[#e5e1d8] hover:border-[#C6A66B]/50 transition-all duration-300 p-3 group">
        <div className="relative w-24 h-28 flex-shrink-0 bg-[#f0ede8] overflow-hidden">
          {product.images?.[0] && (
            <Image src={product.images[0]} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="96px" />
          )}
        </div>
        <div className="flex-1 min-w-0 py-1">
          <p className="text-xs text-[#C6A66B] tracking-wider uppercase mb-1 font-light">{product.brand?.name}</p>
          <h3 className="text-sm font-medium text-[#111111] leading-snug mb-2 line-clamp-2">{product.name}</h3>
          <div className="flex items-center gap-1 mb-2">
            <Star size={11} fill="#C6A66B" className="text-[#C6A66B]" />
            <span className="text-xs text-[#6b7280]">{product.rating} ({product.review_count})</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[#111111]">{formatPrice(product.price)}</span>
            {product.original_price && product.original_price > product.price && (
              <span className="text-xs text-[#6b7280] line-through">{formatPrice(product.original_price)}</span>
            )}
          </div>
        </div>
      </Link>
    )
  }

  return (
    <Link
      href={`/products/${product.slug}`}
      className="product-card group block bg-white hover-lift"
    >
      {/* Image Container */}
      <div
        className="relative overflow-hidden bg-[#f0ede8] aspect-[3/4]"
        onMouseEnter={() => product.images?.length > 1 && setImageIndex(1)}
        onMouseLeave={() => setImageIndex(0)}
      >
        {product.images?.[imageIndex] && (
          <Image
            src={product.images[imageIndex]}
            alt={product.name}
            fill
            className="object-cover transition-all duration-700 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {discount > 0 && (
            <span className="bg-[#111111] text-[#C6A66B] text-[10px] font-bold tracking-wider px-2 py-1 uppercase">
              -{discount}%
            </span>
          )}
          {isNew && !discount && (
            <span className="bg-[#C6A66B] text-black text-[10px] font-bold tracking-wider px-2 py-1 uppercase">
              New
            </span>
          )}
          {product.stock <= 5 && product.stock > 0 && (
            <span className="bg-red-600 text-white text-[10px] font-bold tracking-wider px-2 py-1 uppercase">
              Low Stock
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlist}
          className="absolute top-3 right-3 z-10 w-8 h-8 bg-white/90 backdrop-blur-sm flex items-center justify-center transition-all duration-200 hover:bg-white opacity-0 group-hover:opacity-100"
          aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart
            size={15}
            className={cn('transition-colors', inWishlist ? 'fill-[#C6A66B] text-[#C6A66B]' : 'text-[#111111]')}
          />
        </button>

        {/* Quick Actions Overlay */}
        <div className="product-overlay">
          <div className="product-actions flex gap-2">
            <button
              onClick={handleAddToCart}
              disabled={addingToCart || product.stock === 0}
              className={cn(
                'flex items-center gap-2 px-4 py-2.5 text-xs font-semibold tracking-widest uppercase transition-all duration-200',
                product.stock === 0
                  ? 'bg-white/60 text-[#6b7280] cursor-not-allowed'
                  : 'btn-gold'
              )}
            >
              {addingToCart ? (
                <span className="w-3 h-3 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              ) : (
                <ShoppingBag size={13} />
              )}
              {product.stock === 0 ? 'Sold Out' : addingToCart ? 'Adding...' : 'Add to Cart'}
            </button>
            <Link
              href={`/products/${product.slug}`}
              onClick={(e) => e.stopPropagation()}
              className="w-10 h-10 bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors"
              aria-label="Quick view"
            >
              <Eye size={15} className="text-[#111111]" />
            </Link>
          </div>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-3 md:p-4">
        {/* Brand */}
        <p className="text-xs text-[#C6A66B] tracking-widest uppercase mb-1 font-light">{product.brand?.name}</p>

        {/* Name */}
        <h3 className="font-medium text-[#111111] text-sm leading-snug mb-2 line-clamp-2 group-hover:text-[#C6A66B] transition-colors">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mb-2">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={11}
                className={star <= Math.round(product.rating) ? 'star-filled fill-current' : 'star-empty'}
              />
            ))}
          </div>
          <span className="text-xs text-[#6b7280]">({product.review_count})</span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2">
          <span className="font-semibold text-[#111111]">{formatPrice(product.price)}</span>
          {product.original_price && product.original_price > product.price && (
            <span className="text-xs text-[#6b7280] line-through">{formatPrice(product.original_price)}</span>
          )}
        </div>
      </div>
    </Link>
  )
}
