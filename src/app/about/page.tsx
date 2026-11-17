import type { Metadata } from 'next'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about ÉLÉGANCE, our story, craftsmanship, philosophy, and dedication to timeless luxury fashion.',
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#F8F7F4]">
      {/* Hero */}
      <div className="relative py-20 md:py-32 bg-[#111111] text-white overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-16 text-center">
          <p className="text-[#C6A66B] text-xs tracking-[0.3em] uppercase font-light mb-4">Our Heritage</p>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white mb-6">
            Redefining the Art of Fashion
          </h1>
          <div className="section-divider" />
          <p className="text-white/70 max-w-2xl mx-auto font-light text-base md:text-lg leading-relaxed mt-6">
            Founded with a singular vision: to curate an exceptional marketplace of fine garments, exquisite tailoring, and timeless style for the modern discerning individual.
          </p>
        </div>
      </div>

      {/* Philosophy Section */}
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-16 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div>
            <p className="text-[#C6A66B] text-xs tracking-[0.3em] uppercase font-light mb-3">Our Philosophy</p>
            <h2 className="font-serif text-3xl md:text-4xl text-[#111111] mb-6">Quality Over Quantity</h2>
            <div className="space-y-4 text-[#6b7280] font-light leading-relaxed text-sm md:text-base">
              <p>
                In a world of fast fashion and ephemeral trends, ÉLÉGANCE stands for enduring sophistication. Every brand and artisan on our platform undergoes a rigorous selection process to ensure that only the highest standard of craftsmanship reaches your wardrobe.
              </p>
              <p>
                We believe that true luxury lies in the details: the hand-finished seams of an Oxford shirt, the tactile richness of Italian wool, the suppleness of full-grain leather that only grows more beautiful with time.
              </p>
            </div>
          </div>
          <div className="relative aspect-[4/3] bg-[#e5e1d8] overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1445205170230-053b83016050?w=1000"
              alt="Craftsmanship"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>

        {/* Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 pt-16 border-t border-[#e5e1d8]">
          {[
            {
              title: 'Curation',
              desc: 'We partner exclusively with designers and ateliers whose commitment to fabric quality, ethical production, and timeless aesthetic matches our uncompromising standards.',
            },
            {
              title: 'Craftsmanship',
              desc: 'From Egyptian cottons and mulberry silks to vegetable-tanned leathers, our collections represent the pinnacle of artisanal fashion made to last for seasons.',
            },
            {
              title: 'Customer Exclusivity',
              desc: 'We provide an elevated shopping experience from the moment you browse to white-glove packaging and dedicated style consultation services.',
            },
          ].map(({ title, desc }) => (
            <div key={title} className="p-8 bg-white border border-[#e5e1d8]">
              <h3 className="font-serif text-xl text-[#111111] mb-3">{title}</h3>
              <p className="text-[#6b7280] text-sm font-light leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
