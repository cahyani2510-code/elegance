'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Trash2, Plus, Minus, ArrowRight, ShieldCheck, Truck } from 'lucide-react'
import { useCartStore } from '@/store'
import { formatPrice } from '@/lib/utils'

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotalPrice, getTotalItems, clearCart } = useCartStore()
  const [promoCode, setPromoCode] = useState('')
  const [discount, setDiscount] = useState(0)
  const [promoError, setPromoError] = useState('')
  const [promoSuccess, setPromoSuccess] = useState('')

  const subtotal = getTotalPrice()
  const totalItems = getTotalItems()
  const shipping = subtotal > 500000 || subtotal === 0 ? 0 : 25000
  const total = subtotal - discount + shipping

  const applyPromo = (e: React.FormEvent) => {
    e.preventDefault()
    setPromoError('')
    setPromoSuccess('')
    if (promoCode.toUpperCase() === 'ELEGANCE10') {
      const d = Math.round(subtotal * 0.1)
      setDiscount(d)
      setPromoSuccess(`10% discount applied (-${formatPrice(d)})`)
    } else {
      setPromoError('Invalid promo code. Try: ELEGANCE10')
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#F8F7F4] flex items-center justify-center py-16 px-4">
        <div className="bg-white border border-[#e5e1d8] p-12 text-center max-w-md w-full">
          <h2 className="font-serif text-2xl text-[#111111] mb-2">Your cart is empty</h2>
          <p className="text-[#6b7280] text-sm font-light mb-6">Discover our collections and add your favourite pieces.</p>
          <Link href="/products" className="btn-gold px-8 py-4 text-xs inline-flex items-center gap-2">
            Continue Shopping <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F8F7F4] py-12">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-[#C6A66B] text-xs tracking-[0.3em] uppercase font-light mb-1">Your Order</p>
            <h1 className="font-serif text-3xl text-[#111111]">Shopping Cart ({totalItems})</h1>
          </div>
          <button
            onClick={clearCart}
            className="text-xs text-[#6b7280] hover:text-red-500 transition-colors"
          >
            Clear Cart
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items List */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="bg-white border border-[#e5e1d8] p-4 md:p-6 flex gap-4 md:gap-6">
                {/* Product Image */}
                <Link
                  href={`/products/${item.product?.slug}`}
                  className="relative w-24 h-32 md:w-28 md:h-36 flex-shrink-0 bg-[#f0ede8] overflow-hidden"
                >
                  {item.product?.images?.[0] && (
                    <Image src={item.product.images[0]} alt={item.product.name} fill className="object-cover" sizes="112px" />
                  )}
                </Link>

                {/* Info */}
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <p className="text-xs text-[#C6A66B] uppercase tracking-wider mb-1 font-light">{item.product?.brand?.name}</p>
                    <Link href={`/products/${item.product?.slug}`}>
                      <h3 className="font-medium text-[#111111] text-base mb-1 hover:text-[#C6A66B] transition-colors">{item.product?.name}</h3>
                    </Link>
                    {item.variant && (
                      <div className="flex items-center gap-3 text-xs text-[#6b7280] mb-2">
                        {item.variant.size && <span>Size: <strong className="text-[#111111]">{item.variant.size}</strong></span>}
                        {item.variant.color && <span>Color: <strong className="text-[#111111]">{item.variant.color}</strong></span>}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    {/* Quantity Controls */}
                    <div className="flex items-center border border-[#e5e1d8]">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-[#f0ede8] transition-colors"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="w-10 text-center text-sm font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-[#f0ede8] transition-colors"
                      >
                        <Plus size={12} />
                      </button>
                    </div>

                    {/* Price & Remove */}
                    <div className="flex items-center gap-4">
                      <span className="font-semibold text-base text-[#111111]">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-[#6b7280] hover:text-red-500 transition-colors p-1"
                        aria-label="Remove item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <div className="bg-white border border-[#e5e1d8] p-6">
              <h2 className="font-serif text-lg text-[#111111] mb-5">Order Summary</h2>

              {/* Promo Code */}
              <form onSubmit={applyPromo} className="mb-6">
                <label className="block text-xs font-medium uppercase tracking-wider text-[#111111] mb-2">Promo Code</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="ELEGANCE10"
                    className="flex-1 border border-[#e5e1d8] px-3 py-2 text-sm uppercase focus:border-[#C6A66B]"
                  />
                  <button type="submit" className="btn-outline-gold px-4 py-2 text-xs">
                    Apply
                  </button>
                </div>
                {promoError && <p className="text-xs text-red-500 mt-1">{promoError}</p>}
                {promoSuccess && <p className="text-xs text-green-600 mt-1">{promoSuccess}</p>}
              </form>

              {/* Price Details */}
              <div className="space-y-3 border-t border-[#e5e1d8] pt-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#6b7280] font-light">Subtotal ({totalItems} items)</span>
                  <span className="font-medium text-[#111111]">{formatPrice(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-[#16a34a]">
                    <span>Discount (10%)</span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-[#6b7280] font-light">Shipping</span>
                  <span className={shipping === 0 ? 'text-[#16a34a] font-medium' : 'text-[#111111]'}>
                    {shipping === 0 ? 'FREE' : formatPrice(shipping)}
                  </span>
                </div>
                <div className="flex justify-between font-semibold text-base pt-3 border-t border-[#e5e1d8]">
                  <span className="text-[#111111]">Total</span>
                  <span className="text-[#111111]">{formatPrice(total)}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <Link
                href="/checkout"
                className="btn-gold w-full py-4 text-xs flex items-center justify-center gap-2 mt-6"
              >
                Proceed to Checkout <ArrowRight size={14} />
              </Link>
            </div>

            {/* Badges */}
            <div className="bg-white border border-[#e5e1d8] p-4 space-y-3 text-xs text-[#6b7280]">
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-[#C6A66B] flex-shrink-0" />
                <span>Secure SSL encrypted checkout</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck size={16} className="text-[#C6A66B] flex-shrink-0" />
                <span>Free shipping on orders above Rp 500.000</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
