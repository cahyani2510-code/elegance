'use client'

import Link from 'next/link'
import { Heart, ArrowRight } from 'lucide-react'
import { useWishlistStore } from '@/store'
import ProductCard from '@/components/product/ProductCard'

export default function WishlistPage() {
  const { items, removeItem } = useWishlistStore()

  return (
    <div className="min-h-screen bg-[#F8F7F4] py-12">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-16">
        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-[#C6A66B] text-xs tracking-[0.3em] uppercase font-light mb-2">My Saved Items</p>
          <h1 className="font-serif text-3xl md:text-4xl text-[#111111] mb-2">Wishlist</h1>
          <p className="text-[#6b7280] text-sm font-light">{items.length} items saved</p>
        </div>

        {items.length === 0 ? (
          <div className="bg-white border border-[#e5e1d8] p-12 text-center max-w-md mx-auto">
            <div className="w-16 h-16 bg-[#f0ede8] rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart size={28} className="text-[#6b7280]" />
            </div>
            <h2 className="font-serif text-xl text-[#111111] mb-2">Your wishlist is empty</h2>
            <p className="text-[#6b7280] text-sm font-light mb-6">
              Save pieces you love to your wishlist to keep track of them and buy later.
            </p>
            <Link href="/products" className="btn-gold px-6 py-3 text-xs inline-flex items-center gap-2">
              Explore Products <ArrowRight size={14} />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {items.map((item) => item.product && (
              <ProductCard key={item.id} product={item.product} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
