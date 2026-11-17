import Link from 'next/link'
import Image from 'next/image'
import { mockCategories } from '@/data/mock'

export default function CategoryGrid() {
  const categories = mockCategories.slice(0, 6)

  return (
    <section className="py-16 md:py-20 bg-[#F8F7F4]">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-16">
        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-[#C6A66B] text-xs tracking-[0.3em] uppercase font-light mb-3">Browse By Category</p>
          <h2 className="font-serif text-3xl md:text-4xl text-[#111111] mb-4">Shop The Collection</h2>
          <div className="section-divider" />
        </div>

        {/* Categories */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/products?category=${category.slug}`}
              className="group text-center"
            >
              <div className="relative overflow-hidden aspect-square mb-3 bg-[#e5e1d8]">
                {category.image_url && (
                  <Image
                    src={category.image_url}
                    alt={category.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                  />
                )}
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all duration-300" />
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#C6A66B]/70 transition-all duration-300" />
              </div>
              <h3 className="text-xs tracking-widest uppercase font-light text-[#111111] group-hover:text-[#C6A66B] transition-colors">
                {category.name}
              </h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
