'use client'

import { useState } from 'react'
import { Users, Store, DollarSign, ShoppingCart, Check, X, ShieldAlert, BarChart3 } from 'lucide-react'
import { mockSellers, mockProducts } from '@/data/mock'
import { formatPrice } from '@/lib/utils'
import toast from 'react-hot-toast'

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<'stats' | 'sellers' | 'commission'>('stats')
  const [sellers, setSellers] = useState([
    ...mockSellers,
    {
      id: '3', user_id: 'u6', store_name: 'Atelier Mode Jakarta', store_slug: 'atelier-mode',
      store_description: 'Couture dresses & tailored pieces', province: 'DKI Jakarta', city: 'Jakarta Selatan',
      rating: 0, review_count: 0, total_sales: 0, is_verified: false, is_active: true, created_at: '2024-10-28'
    }
  ])

  const verifySeller = (id: string) => {
    setSellers(sellers.map(s => s.id === id ? { ...s, is_verified: true } : s))
    toast.success('Seller verified successfully')
  }

  return (
    <div className="min-h-screen bg-[#F8F7F4] py-8">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-16">
        {/* Header */}
        <div className="bg-[#111111] p-6 md:p-8 text-white mb-8">
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider">
              Super Admin
            </span>
          </div>
          <h1 className="font-serif text-2xl md:text-3xl">Platform Management</h1>
          <p className="text-white/60 text-xs font-light mt-1">Platform analytics, user moderation, and commission management</p>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { title: 'Total GMV', value: 'Rp 284.500.000', sub: 'Gross Merchandise Value', icon: DollarSign },
            { title: 'Marketplace Commission', value: 'Rp 28.450.000', sub: '10% average fee', icon: BarChart3 },
            { title: 'Active Sellers', value: sellers.length.toString(), sub: '1 pending verification', icon: Store },
            { title: 'Total Customers', value: '4,892', sub: '+12% this month', icon: Users },
          ].map(({ title, value, sub, icon: Icon }) => (
            <div key={title} className="bg-white border border-[#e5e1d8] p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-[#6b7280] uppercase tracking-wider font-light">{title}</span>
                <Icon size={18} className="text-[#C6A66B]" />
              </div>
              <p className="font-serif text-2xl font-bold text-[#111111] mb-1">{value}</p>
              <p className="text-xs text-[#6b7280] font-light">{sub}</p>
            </div>
          ))}
        </div>

        {/* Tab Controls */}
        <div className="flex gap-4 border-b border-[#e5e1d8] mb-6">
          {(['stats', 'sellers', 'commission'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 text-sm tracking-wider uppercase font-light transition-all capitalize ${
                activeTab === tab
                  ? 'text-[#111111] font-medium border-b-2 border-[#C6A66B]'
                  : 'text-[#6b7280] hover:text-[#111111]'
              }`}
            >
              {tab === 'sellers' ? `Seller Verification (${sellers.filter(s => !s.is_verified).length} pending)` : tab}
            </button>
          ))}
        </div>

        {/* Sellers Tab */}
        {(activeTab === 'sellers' || activeTab === 'stats') && (
          <div className="bg-white border border-[#e5e1d8] mb-8">
            <div className="p-4 border-b border-[#e5e1d8]">
              <h3 className="font-medium text-sm text-[#111111] uppercase tracking-wider">Seller Verification Management</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-[#e5e1d8] bg-[#f8f7f4] text-xs text-[#6b7280] uppercase tracking-wider">
                    <th className="p-4">Store</th>
                    <th className="p-4">Location</th>
                    <th className="p-4">Total Sales</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Verification</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e5e1d8]">
                  {sellers.map((s) => (
                    <tr key={s.id} className="hover:bg-[#f8f7f4]">
                      <td className="p-4">
                        <p className="font-medium text-[#111111]">{s.store_name}</p>
                        <p className="text-xs text-[#6b7280] font-light">{s.store_description}</p>
                      </td>
                      <td className="p-4 text-xs text-[#6b7280]">{s.city}, {s.province}</td>
                      <td className="p-4 font-medium text-[#111111]">{formatPrice(s.total_sales)}</td>
                      <td className="p-4">
                        {s.is_verified ? (
                          <span className="bg-green-100 text-green-800 text-[10px] font-semibold uppercase px-2 py-0.5">
                            Verified
                          </span>
                        ) : (
                          <span className="bg-yellow-100 text-yellow-800 text-[10px] font-semibold uppercase px-2 py-0.5">
                            Pending Review
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        {!s.is_verified && (
                          <button
                            onClick={() => verifySeller(s.id)}
                            className="btn-gold px-3 py-1.5 text-xs inline-flex items-center gap-1"
                          >
                            <Check size={12} /> Approve
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Commission Policy */}
        {activeTab === 'commission' && (
          <div className="bg-white border border-[#e5e1d8] p-6 max-w-xl">
            <h3 className="font-serif text-lg text-[#111111] mb-4">Commission Structure</h3>
            <div className="space-y-4 text-sm text-[#6b7280]">
              <div className="flex justify-between border-b border-[#e5e1d8] pb-3">
                <span className="text-[#111111] font-medium">Standard Category Commission</span>
                <span className="font-bold text-[#111111]">10%</span>
              </div>
              <div className="flex justify-between border-b border-[#e5e1d8] pb-3">
                <span className="text-[#111111] font-medium">Luxury Brands (&gt; Rp 3.000.000)</span>
                <span className="font-bold text-[#111111]">8%</span>
              </div>
              <div className="flex justify-between border-b border-[#e5e1d8] pb-3">
                <span className="text-[#111111] font-medium">Payment Gateway Fee (Direct Pass-through)</span>
                <span className="font-bold text-[#111111]">1.5%</span>
              </div>
            </div>
            <button className="btn-gold px-5 py-2.5 text-xs mt-6">Update Rates</button>
          </div>
        )}
      </div>
    </div>
  )
}
