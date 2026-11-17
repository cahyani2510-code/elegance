import Link from 'next/link'
import { mockBrands } from '@/data/mock'

export default function BrandsSection() {
  const featuredBrands = mockBrands.filter(b => b.is_featured)

  return (
    <section className="py-14 md:py-20 bg-white border-y border-[#e5e1d8]">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-16">
        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-[#C6A66B] text-xs tracking-[0.3em] uppercase font-light mb-3">Premium Partners</p>
          <h2 className="font-serif text-3xl md:text-4xl text-[#111111] mb-4">Featured Brands</h2>
          <div className="section-divider" />
        </div>

        {/* Brands */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
          {featuredBrands.map((brand) => (
            <Link
              key={brand.id}
              href={`/brands/${brand.slug}`}
              className="group border border-[#e5e1d8] hover:border-[#C6A66B]/60 transition-all duration-300 p-6 md:p-8 flex flex-col items-center justify-center text-center gap-3"
            >
              {/* Brand Logo Placeholder (text-based) */}
              <div className="w-16 h-16 bg-[#f0ede8] rounded-full flex items-center justify-center group-hover:bg-[#C6A66B]/10 transition-colors">
                <span className="font-serif text-2xl text-[#C6A66B] font-bold">
                  {brand.name.charAt(0)}
                </span>
              </div>
              <div>
                <h3 className="font-serif text-sm text-[#111111] group-hover:text-[#C6A66B] transition-colors tracking-wider">
                  {brand.name}
                </h3>
                <p className="text-xs text-[#6b7280] font-light mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {brand.description}
                </p>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link
            href="/brands"
            className="btn-outline-gold px-8 py-3 inline-flex items-center gap-2 text-xs"
          >
            View All Brands
          </Link>
        </div>
      </div>
    </section>
  )
}
