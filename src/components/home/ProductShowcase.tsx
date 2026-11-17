'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { mockProducts } from '@/data/mock'
import ProductCard from '@/components/product/ProductCard'
import { cn } from '@/lib/utils'

const tabs = ['Best Sellers', 'New Arrivals', 'Featured']

export default function ProductShowcase() {
  const [activeTab, setActiveTab] = useState('Best Sellers')

  const filteredProducts = mockProducts
    .filter((p) => {
      if (activeTab === 'Best Sellers') return p.sold_count > 400
      if (activeTab === 'New Arrivals') return new Date(p.created_at) > new Date('2024-09-01')
      if (activeTab === 'Featured') return p.is_featured
      return true
    })
    .slice(0, 8)

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-16">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-10 gap-4">
          <div>
            <p className="text-[#C6A66B] text-xs tracking-[0.3em] uppercase font-light mb-3">Our Selection</p>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-[#111111]">Premium Picks</h2>
          </div>
          <Link
            href="/products"
            className="flex items-center gap-2 text-[#111111] text-xs tracking-widest uppercase hover:text-[#C6A66B] transition-colors group font-medium"
          >
            View All Products
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex gap-6 mb-8 border-b border-[#e5e1d8]">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                'pb-3 text-sm tracking-wider uppercase font-light transition-all duration-200 relative',
                activeTab === tab
                  ? 'text-[#111111] font-medium'
                  : 'text-[#6b7280] hover:text-[#111111]'
              )}
            >
              {tab}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-gold" />
              )}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}
