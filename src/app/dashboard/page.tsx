'use client'

import { useState } from 'react'
import Link from 'next/link'
import { User, Package, MapPin, Heart, LogOut, ChevronRight, Eye } from 'lucide-react'
import { useAuthStore } from '@/store'
import { formatPrice, formatDate } from '@/lib/utils'

const mockOrders = [
  {
    id: 'ELG-LX92-4A2B',
    date: '2024-10-25',
    total: 1700000,
    status: 'delivered',
    payment_status: 'paid',
    items: [
      { name: 'Premium Oxford Button-Down Shirt', qty: 1, price: 1250000 },
      { name: 'Supima Cotton Essentials Tee', qty: 1, price: 450000 },
    ],
    tracking_number: 'JNE1092837465',
    courier: 'JNE Regular',
  },
  {
    id: 'ELG-LX88-1B9C',
    date: '2024-10-10',
    total: 3500000,
    status: 'shipped',
    payment_status: 'paid',
    items: [
      { name: 'Italian Wool Blazer Jacket', qty: 1, price: 3500000 },
    ],
    tracking_number: 'SIC8392019283',
    courier: 'SiCepat BEST',
  },
]

const statusBadges: Record<string, { label: string; class: string }> = {
  pending: { label: 'Pending', class: 'bg-yellow-100 text-yellow-800' },
  processing: { label: 'Processing', class: 'bg-blue-100 text-blue-800' },
  shipped: { label: 'Shipped', class: 'bg-purple-100 text-purple-800' },
  delivered: { label: 'Delivered', class: 'bg-green-100 text-green-800' },
  cancelled: { label: 'Cancelled', class: 'bg-red-100 text-red-800' },
}

export default function CustomerDashboardPage() {
  const { user, logout } = useAuthStore()
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'addresses'>('orders')

  return (
    <div className="min-h-screen bg-[#F8F7F4] py-12">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-16">
        {/* User Greeting */}
        <div className="bg-[#111111] p-6 md:p-8 text-white mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <p className="text-[#C6A66B] text-xs uppercase tracking-widest font-light">Customer Account</p>
            <h1 className="font-serif text-2xl md:text-3xl text-white">
              Welcome back, {user?.full_name || 'Sarah Wijaya'}
            </h1>
            <p className="text-white/60 text-xs font-light mt-1">{user?.email || 'sarah@example.com'}</p>
          </div>
          <div className="flex gap-3">
            <Link href="/seller/dashboard" className="btn-outline-gold px-4 py-2 text-xs border-white/20 text-white hover:bg-white hover:text-black">
              Seller Center
            </Link>
            <Link href="/admin" className="btn-outline-gold px-4 py-2 text-xs border-white/20 text-white hover:bg-white hover:text-black">
              Admin Panel
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="space-y-1 bg-white border border-[#e5e1d8] p-3">
            {[
              { id: 'orders', label: 'My Orders', icon: Package },
              { id: 'profile', label: 'Profile Information', icon: User },
              { id: 'addresses', label: 'Shipping Addresses', icon: MapPin },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as typeof activeTab)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors text-left font-light ${
                  activeTab === id
                    ? 'bg-[#111111] text-white font-medium'
                    : 'text-[#111111] hover:bg-[#f8f7f4]'
                }`}
              >
                <Icon size={16} />
                {label}
              </button>
            ))}
            <Link
              href="/wishlist"
              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-[#111111] hover:bg-[#f8f7f4] transition-colors font-light"
            >
              <Heart size={16} />
              Wishlist
            </Link>
            <button
              onClick={() => { logout(); window.location.href = '/' }}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors font-light"
            >
              <LogOut size={16} />
              Sign Out
            </button>
          </div>

          {/* Main Content Area */}
          <div className="md:col-span-3 space-y-6">
            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div className="space-y-4">
                <h2 className="font-serif text-xl text-[#111111]">Order History</h2>
                {mockOrders.map(order => (
                  <div key={order.id} className="bg-white border border-[#e5e1d8] p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#e5e1d8] gap-2 mb-4">
                      <div>
                        <p className="text-xs text-[#6b7280] font-light">Order Number</p>
                        <p className="font-mono font-bold text-sm text-[#111111]">{order.id}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`text-xs px-2.5 py-1 font-semibold uppercase tracking-wider rounded-sm ${statusBadges[order.status]?.class}`}>
                          {statusBadges[order.status]?.label}
                        </span>
                        <span className="text-xs text-[#6b7280] font-light">{formatDate(order.date)}</span>
                      </div>
                    </div>

                    {/* Items */}
                    <div className="space-y-2 mb-4">
                      {order.items.map(item => (
                        <div key={item.name} className="flex justify-between text-sm">
                          <span className="text-[#111111] font-light">{item.name} &times; {item.qty}</span>
                          <span className="font-medium text-[#111111]">{formatPrice(item.price * item.qty)}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-4 border-t border-[#e5e1d8] gap-3">
                      <div>
                        {order.tracking_number && (
                          <p className="text-xs text-[#6b7280]">
                            Tracking ({order.courier}): <span className="font-mono font-medium text-[#111111]">{order.tracking_number}</span>
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-semibold text-base text-[#111111]">
                          Total: {formatPrice(order.total)}
                        </span>
                        <Link
                          href={`/orders/${order.id}`}
                          className="btn-outline-gold px-3 py-1.5 text-xs inline-flex items-center gap-1"
                        >
                          <Eye size={12} /> View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="bg-white border border-[#e5e1d8] p-6 space-y-6">
                <h2 className="font-serif text-xl text-[#111111]">Profile Details</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[#111111] uppercase tracking-wider mb-1">Full Name</label>
                    <input
                      type="text"
                      defaultValue={user?.full_name || 'Sarah Wijaya'}
                      className="w-full border border-[#e5e1d8] px-3 py-2 text-sm focus:border-[#C6A66B]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#111111] uppercase tracking-wider mb-1">Email</label>
                    <input
                      type="email"
                      defaultValue={user?.email || 'sarah@example.com'}
                      className="w-full border border-[#e5e1d8] px-3 py-2 text-sm bg-gray-50 text-gray-500"
                      disabled
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#111111] uppercase tracking-wider mb-1">Phone</label>
                    <input
                      type="tel"
                      defaultValue="081234567890"
                      className="w-full border border-[#e5e1d8] px-3 py-2 text-sm focus:border-[#C6A66B]"
                    />
                  </div>
                </div>
                <button className="btn-gold px-6 py-2.5 text-xs">Save Changes</button>
              </div>
            )}

            {/* Addresses Tab */}
            {activeTab === 'addresses' && (
              <div className="bg-white border border-[#e5e1d8] p-6 space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="font-serif text-xl text-[#111111]">Saved Addresses</h2>
                  <button className="btn-gold px-4 py-2 text-xs">+ Add New Address</button>
                </div>
                <div className="border border-[#C6A66B] p-4 relative bg-[#f8f7f4]">
                  <span className="absolute top-3 right-3 text-xs bg-[#C6A66B] text-black px-2 py-0.5 font-semibold">Primary</span>
                  <p className="font-medium text-sm text-[#111111]">Home — Sarah Wijaya</p>
                  <p className="text-xs text-[#6b7280] font-light mt-1">081234567890</p>
                  <p className="text-xs text-[#6b7280] font-light mt-1">Jl. Senopati No. 42, Kebayoran Baru, Jakarta Selatan, DKI Jakarta 12190</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
