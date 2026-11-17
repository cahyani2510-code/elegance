import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { featuredCollections } from '@/data/mock'

export default function FeaturedCollections() {
  return (
    <section className="py-16 md:py-24 bg-[#F8F7F4]">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-16">
        {/* Section Header */}
        <div className="text-center mb-12">
          <p className="text-[#C6A66B] text-xs tracking-[0.3em] uppercase font-light mb-3">Curated For You</p>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-[#111111] mb-4">Featured Collections</h2>
          <div className="section-divider" />
          <p className="text-[#6b7280] font-light max-w-lg mx-auto mt-4">
            Explore our carefully curated collections, each telling a unique story of modern elegance.
          </p>
        </div>

        {/* Collections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {featuredCollections.map((collection, index) => (
            <Link
              key={collection.id}
              href={collection.link}
              className="group relative overflow-hidden block"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Image */}
              <div className={`relative overflow-hidden ${index === 0 ? 'aspect-[4/5]' : 'aspect-[4/5]'}`}>
                <Image
                  src={collection.image}
                  alt={collection.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute inset-0 bg-[#111111]/0 group-hover:bg-[#111111]/20 transition-all duration-500" />

                {/* Gold border on hover */}
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#C6A66B]/60 transition-all duration-500" />
              </div>

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                <p className="text-[#C6A66B] text-xs tracking-[0.3em] uppercase font-light mb-2">
                  {collection.items} pieces
                </p>
                <h3 className="font-serif text-2xl md:text-3xl text-white mb-2">{collection.title}</h3>
                <p className="text-white/70 text-sm font-light mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {collection.description}
                </p>
                <div className="flex items-center gap-2 text-[#C6A66B] text-xs tracking-widest uppercase font-medium">
                  <span>Explore</span>
                  <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform duration-300" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
