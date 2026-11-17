'use client'

import { useEffect } from 'react'
import { X, ShoppingBag, Trash2, Plus, Minus, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useCartStore, useUIStore } from '@/store'
import { formatPrice } from '@/lib/utils'
import { cn } from '@/lib/utils'

export default function CartDrawer() {
  const { items, removeItem, updateQuantity, getTotalPrice, getTotalItems } = useCartStore()
  const { isCartOpen, setCartOpen } = useUIStore()

  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isCartOpen])

  const totalPrice = getTotalPrice()
  const totalItems = getTotalItems()
  const shippingThreshold = 500000
  const freeShippingProgress = Math.min((totalPrice / shippingThreshold) * 100, 100)
  const remaining = Math.max(shippingThreshold - totalPrice, 0)

  return (
    <>
      {/* Overlay */}
      <div
        className={cn(
          'fixed inset-0 bg-black/60 z-50 transition-opacity duration-300',
          isCartOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
        onClick={() => setCartOpen(false)}
      />

      {/* Drawer */}
      <div className={cn(
        'fixed top-0 right-0 h-full w-full max-w-md bg-[#F8F7F4] z-50 flex flex-col transition-transform duration-400 shadow-luxury-lg',
        isCartOpen ? 'translate-x-0' : 'translate-x-full'
      )}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#e5e1d8] bg-white">
          <div className="flex items-center gap-3">
            <ShoppingBag size={20} className="text-[#111111]" />
            <h2 className="font-serif text-lg text-[#111111]">Shopping Cart</h2>
            {totalItems > 0 && (
              <span className="bg-[#C6A66B] text-black text-xs font-semibold px-2 py-0.5 rounded-full">
                {totalItems}
              </span>
            )}
          </div>
          <button
            onClick={() => setCartOpen(false)}
            className="p-2 text-[#6b7280] hover:text-[#111111] transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Free Shipping Progress */}
        {totalItems > 0 && (
          <div className="px-6 py-3 bg-[#111111]/5 border-b border-[#e5e1d8]">
            {remaining > 0 ? (
              <p className="text-xs text-[#6b7280] mb-1.5">
                Add <span className="font-semibold text-[#111111]">{formatPrice(remaining)}</span> more for free shipping
              </p>
            ) : (
              <p className="text-xs text-[#16a34a] font-semibold mb-1.5">🎉 You have free shipping!</p>
            )}
            <div className="w-full h-1 bg-white rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-gold rounded-full transition-all duration-500"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <div className="w-20 h-20 bg-[#e5e1d8] rounded-full flex items-center justify-center mb-4">
                <ShoppingBag size={32} className="text-[#6b7280]" />
              </div>
              <h3 className="font-serif text-xl text-[#111111] mb-2">Your cart is empty</h3>
              <p className="text-[#6b7280] text-sm mb-6 font-light">Discover our premium collections and find your perfect piece.</p>
              <Link
                href="/products"
                onClick={() => setCartOpen(false)}
                className="btn-gold px-6 py-3 text-xs inline-flex items-center gap-2"
              >
                Shop Now <ArrowRight size={14} />
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 bg-white p-3 border border-[#e5e1d8] group">
                  {/* Product Image */}
                  <Link
                    href={`/products/${item.product?.slug}`}
                    onClick={() => setCartOpen(false)}
                    className="relative w-20 h-24 flex-shrink-0 overflow-hidden bg-[#f0ede8]"
                  >
                    {item.product?.images?.[0] ? (
                      <Image
                        src={item.product.images[0]}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    ) : (
                      <div className="w-full h-full bg-[#e5e1d8]" />
                    )}
                  </Link>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/products/${item.product?.slug}`}
                      onClick={() => setCartOpen(false)}
                    >
                      <h4 className="text-sm font-medium text-[#111111] leading-snug mb-1 hover:text-[#C6A66B] transition-colors line-clamp-2">
                        {item.product?.name}
                      </h4>
                    </Link>
                    {item.variant && (
                      <div className="flex items-center gap-2 mb-2">
                        {item.variant.size && (
                          <span className="text-xs text-[#6b7280] border border-[#e5e1d8] px-1.5 py-0.5">
                            {item.variant.size}
                          </span>
                        )}
                        {item.variant.color && (
                          <div className="flex items-center gap-1">
                            <div
                              className="w-3 h-3 rounded-full border border-[#e5e1d8]"
                              style={{ backgroundColor: item.variant.color_hex }}
                            />
                            <span className="text-xs text-[#6b7280]">{item.variant.color}</span>
                          </div>
                        )}
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-[#111111]">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-6 h-6 border border-[#e5e1d8] flex items-center justify-center hover:border-[#111111] transition-colors"
                        >
                          <Minus size={10} />
                        </button>
                        <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-6 h-6 border border-[#e5e1d8] flex items-center justify-center hover:border-[#111111] transition-colors"
                        >
                          <Plus size={10} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeItem(item.id)}
                    className="self-start p-1 text-[#e5e1d8] hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-[#e5e1d8] bg-white px-6 py-5">
            <div className="space-y-2 mb-5">
              <div className="flex justify-between text-sm">
                <span className="text-[#6b7280] font-light">Subtotal ({totalItems} items)</span>
                <span className="font-semibold text-[#111111]">{formatPrice(totalPrice)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#6b7280] font-light">Shipping</span>
                <span className={remaining === 0 ? 'text-[#16a34a] font-medium' : 'text-[#6b7280]'}>
                  {remaining === 0 ? 'Free' : 'Calculated at checkout'}
                </span>
              </div>
              <div className="flex justify-between text-base font-semibold pt-2 border-t border-[#e5e1d8]">
                <span className="text-[#111111]">Total</span>
                <span className="text-[#111111]">{formatPrice(totalPrice)}</span>
              </div>
            </div>
            <Link
              href="/checkout"
              onClick={() => setCartOpen(false)}
              className="btn-gold w-full py-4 flex items-center justify-center gap-2 text-xs"
            >
              Proceed to Checkout <ArrowRight size={14} />
            </Link>
            <button
              onClick={() => setCartOpen(false)}
              className="w-full text-center text-xs text-[#6b7280] hover:text-[#111111] transition-colors mt-3 py-2"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  )
}
