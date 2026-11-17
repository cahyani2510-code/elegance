'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { CheckCircle2, ChevronRight, CreditCard, QrCode, Building, Wallet, Truck, AlertCircle } from 'lucide-react'
import { useCartStore } from '@/store'
import { formatPrice, generateOrderNumber, cn } from '@/lib/utils'
import toast from 'react-hot-toast'

const PAYMENT_METHODS = [
  { id: 'bca_va', name: 'BCA Virtual Account', type: 'va', icon: Building, desc: 'Automatic confirmation' },
  { id: 'mandiri_va', name: 'Mandiri Virtual Account', type: 'va', icon: Building, desc: 'Automatic confirmation' },
  { id: 'qris', name: 'QRIS', type: 'qris', icon: QrCode, desc: 'GoPay, OVO, DANA, ShopeePay' },
  { id: 'gopay', name: 'GoPay', type: 'ewallet', icon: Wallet, desc: 'Direct from GoPay app' },
  { id: 'credit_card', name: 'Credit / Debit Card', type: 'card', icon: CreditCard, desc: 'Visa, Mastercard, JCB' },
]

const SHIPPING_OPTIONS = [
  { id: 'jne_reg', courier: 'JNE', service: 'Regular (REG)', etd: '2-3 days', cost: 22000 },
  { id: 'jne_yes', courier: 'JNE', service: 'Yakin Esok Sampai (YES)', etd: '1 day', cost: 38000 },
  { id: 'sicepat_reg', courier: 'SiCepat', service: 'Regular', etd: '2-3 days', cost: 20000 },
  { id: 'sicepat_best', courier: 'SiCepat', service: 'BEST (Next Day)', etd: '1 day', cost: 35000 },
]

export default function CheckoutPage() {
  const router = useRouter()
  const { items, getTotalPrice, clearCart } = useCartStore()

  const [shippingMethod, setShippingMethod] = useState(SHIPPING_OPTIONS[0].id)
  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHODS[0].id)
  const [submitting, setSubmitting] = useState(false)
  const [orderComplete, setOrderComplete] = useState<{
    orderNumber: string
    paymentMethod: string
    vaNumber?: string
    total: number
  } | null>(null)

  const [address, setAddress] = useState({
    name: 'Sarah Wijaya',
    phone: '081234567890',
    address: 'Jl. Senopati No. 42, Kebayoran Baru',
    city: 'Jakarta Selatan',
    province: 'DKI Jakarta',
    postalCode: '12190',
  })

  const subtotal = getTotalPrice()
  const selectedShipping = SHIPPING_OPTIONS.find(s => s.id === shippingMethod)!
  const shippingCost = subtotal > 500000 ? 0 : selectedShipping.cost
  const total = subtotal + shippingCost

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    // Simulate order placement
    await new Promise(r => setTimeout(r, 1500))

    const orderNumber = generateOrderNumber()
    const selectedPay = PAYMENT_METHODS.find(p => p.id === paymentMethod)!

    setOrderComplete({
      orderNumber,
      paymentMethod: selectedPay.name,
      vaNumber: selectedPay.type === 'va' ? '8808' + Math.floor(1000000000 + Math.random() * 9000000000) : undefined,
      total,
    })

    clearCart()
    setSubmitting(false)
  }

  if (items.length === 0 && !orderComplete) {
    return (
      <div className="min-h-screen bg-[#F8F7F4] flex items-center justify-center py-16 px-4">
        <div className="bg-white border border-[#e5e1d8] p-8 text-center max-w-md">
          <h2 className="font-serif text-2xl text-[#111111] mb-3">No items to checkout</h2>
          <p className="text-[#6b7280] text-sm mb-6">Your shopping cart is currently empty.</p>
          <Link href="/products" className="btn-gold px-6 py-3 text-xs">
            Start Shopping
          </Link>
        </div>
      </div>
    )
  }

  // Order Success Screen
  if (orderComplete) {
    return (
      <div className="min-h-screen bg-[#F8F7F4] py-16 px-4">
        <div className="max-w-xl mx-auto bg-white border border-[#e5e1d8] p-8 md:p-12 text-center">
          <div className="w-16 h-16 bg-[#16a34a]/10 text-[#16a34a] rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={36} />
          </div>

          <p className="text-[#C6A66B] text-xs tracking-widest uppercase font-medium mb-1">Order Confirmed</p>
          <h1 className="font-serif text-3xl text-[#111111] mb-2">Thank you for your order!</h1>
          <p className="text-[#6b7280] text-sm font-light mb-8">
            Order <strong className="text-[#111111]">{orderComplete.orderNumber}</strong> has been placed.
          </p>

          {/* Payment Instructions (Simulation Mode) */}
          <div className="bg-[#F8F7F4] border border-[#e5e1d8] p-6 mb-8 text-left">
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-[#C6A66B]/20 text-[#a8873d] text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider">
                Simulated Payment Gateway
              </span>
            </div>
            <p className="text-xs text-[#6b7280] mb-4">
              This is a development simulation. In production, this integrates with <strong>Midtrans / Xendit</strong> payment gateway.
            </p>

            <div className="space-y-3 border-t border-[#e5e1d8] pt-3 text-sm">
              <div className="flex justify-between">
                <span className="text-[#6b7280]">Payment Method:</span>
                <span className="font-medium text-[#111111]">{orderComplete.paymentMethod}</span>
              </div>
              {orderComplete.vaNumber && (
                <div className="flex justify-between items-center">
                  <span className="text-[#6b7280]">Virtual Account No:</span>
                  <span className="font-mono font-bold text-base text-[#111111] bg-white px-2 py-1 border border-[#e5e1d8]">
                    {orderComplete.vaNumber}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-[#6b7280]">Total Amount:</span>
                <span className="font-semibold text-base text-[#111111]">{formatPrice(orderComplete.total)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6b7280]">Status:</span>
                <span className="text-[#ca8a04] font-medium">Waiting for Payment (Simulation)</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard/orders" className="btn-gold px-8 py-3 text-xs">
              View My Orders
            </Link>
            <Link href="/" className="btn-outline-gold px-8 py-3 text-xs">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F8F7F4] py-12">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-16">
        <h1 className="font-serif text-3xl text-[#111111] mb-8">Checkout</h1>

        {/* Integration Notice */}
        <div className="bg-amber-50 border border-amber-200 p-4 mb-8 flex items-start gap-3">
          <AlertCircle size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-amber-800">
            <strong>Payment & Shipping Simulation:</strong> RajaOngkir and Midtrans integrations are set to
            simulation mode. To activate live transactions, configure <code className="bg-amber-100 px-1 py-0.5">MIDTRANS_SERVER_KEY</code> and <code className="bg-amber-100 px-1 py-0.5">RAJAONGKIR_API_KEY</code> in environment variables.
          </div>
        </div>

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Shipping Address */}
            <div className="bg-white border border-[#e5e1d8] p-6">
              <h2 className="font-serif text-lg text-[#111111] mb-4">1. Shipping Address</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#111111] uppercase tracking-wider mb-1">Recipient Name</label>
                  <input
                    type="text"
                    required
                    value={address.name}
                    onChange={(e) => setAddress({ ...address, name: e.target.value })}
                    className="w-full border border-[#e5e1d8] px-3 py-2.5 text-sm focus:border-[#C6A66B]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#111111] uppercase tracking-wider mb-1">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={address.phone}
                    onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                    className="w-full border border-[#e5e1d8] px-3 py-2.5 text-sm focus:border-[#C6A66B]"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-[#111111] uppercase tracking-wider mb-1">Street Address</label>
                  <input
                    type="text"
                    required
                    value={address.address}
                    onChange={(e) => setAddress({ ...address, address: e.target.value })}
                    className="w-full border border-[#e5e1d8] px-3 py-2.5 text-sm focus:border-[#C6A66B]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#111111] uppercase tracking-wider mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                    className="w-full border border-[#e5e1d8] px-3 py-2.5 text-sm focus:border-[#C6A66B]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#111111] uppercase tracking-wider mb-1">Postal Code</label>
                  <input
                    type="text"
                    required
                    value={address.postalCode}
                    onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
                    className="w-full border border-[#e5e1d8] px-3 py-2.5 text-sm focus:border-[#C6A66B]"
                  />
                </div>
              </div>
            </div>

            {/* Shipping Method */}
            <div className="bg-white border border-[#e5e1d8] p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-serif text-lg text-[#111111]">2. Delivery Method</h2>
                <span className="text-xs text-[#C6A66B] font-light">Simulated RajaOngkir</span>
              </div>
              <div className="space-y-3">
                {SHIPPING_OPTIONS.map((opt) => (
                  <label
                    key={opt.id}
                    className={cn(
                      'flex items-center justify-between p-4 border cursor-pointer transition-all',
                      shippingMethod === opt.id
                        ? 'border-[#C6A66B] bg-[#f8f7f4]'
                        : 'border-[#e5e1d8] hover:border-[#C6A66B]/50'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="shipping"
                        value={opt.id}
                        checked={shippingMethod === opt.id}
                        onChange={() => setShippingMethod(opt.id)}
                        className="accent-[#C6A66B]"
                      />
                      <div>
                        <p className="font-medium text-sm text-[#111111]">{opt.courier} — {opt.service}</p>
                        <p className="text-xs text-[#6b7280] font-light">Estimated {opt.etd}</p>
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-[#111111]">
                      {subtotal > 500000 ? (
                        <span className="text-[#16a34a]">FREE</span>
                      ) : (
                        formatPrice(opt.cost)
                      )}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white border border-[#e5e1d8] p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-serif text-lg text-[#111111]">3. Payment Method</h2>
                <span className="text-xs text-[#C6A66B] font-light">Simulated Midtrans</span>
              </div>
              <div className="space-y-3">
                {PAYMENT_METHODS.map((method) => {
                  const Icon = method.icon
                  return (
                    <label
                      key={method.id}
                      className={cn(
                        'flex items-center justify-between p-4 border cursor-pointer transition-all',
                        paymentMethod === method.id
                          ? 'border-[#C6A66B] bg-[#f8f7f4]'
                          : 'border-[#e5e1d8] hover:border-[#C6A66B]/50'
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="payment"
                          value={method.id}
                          checked={paymentMethod === method.id}
                          onChange={() => setPaymentMethod(method.id)}
                          className="accent-[#C6A66B]"
                        />
                        <div className="w-8 h-8 bg-white border border-[#e5e1d8] flex items-center justify-center">
                          <Icon size={16} className="text-[#111111]" />
                        </div>
                        <div>
                          <p className="font-medium text-sm text-[#111111]">{method.name}</p>
                          <p className="text-xs text-[#6b7280] font-light">{method.desc}</p>
                        </div>
                      </div>
                    </label>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-white border border-[#e5e1d8] p-6 sticky top-24">
              <h2 className="font-serif text-lg text-[#111111] mb-5">Order Summary</h2>

              {/* Items List */}
              <div className="space-y-3 max-h-60 overflow-y-auto mb-5 pr-1">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="relative w-14 h-16 flex-shrink-0 bg-[#f0ede8]">
                      {item.product?.images?.[0] && (
                        <Image src={item.product.images[0]} alt={item.product.name} fill className="object-cover" sizes="56px" />
                      )}
                      <span className="absolute -top-1 -right-1 bg-[#111111] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-[#111111] truncate">{item.product?.name}</p>
                      {item.variant && (
                        <p className="text-[11px] text-[#6b7280]">{item.variant.size} · {item.variant.color}</p>
                      )}
                      <p className="text-xs font-semibold text-[#111111] mt-1">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Calculation */}
              <div className="space-y-2 border-t border-[#e5e1d8] pt-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#6b7280] font-light">Subtotal</span>
                  <span className="font-medium text-[#111111]">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6b7280] font-light">Shipping</span>
                  <span className={shippingCost === 0 ? 'text-[#16a34a] font-medium' : 'text-[#111111]'}>
                    {shippingCost === 0 ? 'FREE' : formatPrice(shippingCost)}
                  </span>
                </div>
                <div className="flex justify-between font-semibold text-base pt-3 border-t border-[#e5e1d8]">
                  <span className="text-[#111111]">Total</span>
                  <span className="text-[#111111]">{formatPrice(total)}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="btn-gold w-full py-4 text-xs flex items-center justify-center gap-2 mt-6"
              >
                {submitting ? (
                  <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                ) : (
                  <>Place Order · {formatPrice(total)}</>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
