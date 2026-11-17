'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react'
import { testimonials } from '@/data/mock'
import { cn } from '@/lib/utils'

export default function Testimonials() {
  const [current, setCurrent] = useState(0)

  const prev = () => setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length)
  const next = () => setCurrent((c) => (c + 1) % testimonials.length)

  return (
    <section className="py-16 md:py-24 bg-[#111111] overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-16">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-[#C6A66B] text-xs tracking-[0.3em] uppercase font-light mb-3">What Our Clients Say</p>
          <h2 className="font-serif text-3xl md:text-4xl text-white">Words of Appreciation</h2>
          <div className="section-divider" />
        </div>

        {/* Desktop: Show 2, Mobile: Show 1 */}
        <div className="hidden md:grid grid-cols-2 gap-8">
          {[0, 1].map((offset) => {
            const t = testimonials[(current + offset) % testimonials.length]
            return (
              <div key={t.id} className="border border-white/10 p-8 relative group hover:border-[#C6A66B]/40 transition-all duration-300">
                <Quote size={32} className="text-[#C6A66B]/30 mb-4" />
                <p className="text-white/70 font-light leading-relaxed mb-6 italic">&ldquo;{t.comment}&rdquo;</p>
                <div className="flex items-center gap-4">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                    <Image src={t.avatar} alt={t.name} fill className="object-cover" sizes="48px" />
                  </div>
                  <div>
                    <p className="font-medium text-white text-sm">{t.name}</p>
                    <p className="text-[#C6A66B] text-xs font-light">{t.role} · {t.location}</p>
                  </div>
                  <div className="ml-auto flex">
                    {[1,2,3,4,5].map(s => (
                      <Star key={s} size={12} fill={s <= t.rating ? '#C6A66B' : 'none'} className={s <= t.rating ? 'text-[#C6A66B]' : 'text-white/20'} />
                    ))}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Mobile: Single */}
        <div className="md:hidden">
          <div className="border border-white/10 p-6 relative">
            <Quote size={28} className="text-[#C6A66B]/30 mb-4" />
            <p className="text-white/70 font-light leading-relaxed mb-6 italic">&ldquo;{testimonials[current].comment}&rdquo;</p>
            <div className="flex items-center gap-4">
              <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                <Image src={testimonials[current].avatar} alt={testimonials[current].name} fill className="object-cover" sizes="48px" />
              </div>
              <div>
                <p className="font-medium text-white text-sm">{testimonials[current].name}</p>
                <p className="text-[#C6A66B] text-xs font-light">{testimonials[current].role}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-6 mt-10">
          <button
            onClick={prev}
            className="w-12 h-12 border border-white/20 flex items-center justify-center text-white hover:border-[#C6A66B] hover:text-[#C6A66B] transition-all duration-300"
          >
            <ChevronLeft size={18} />
          </button>
          <div className="flex gap-2">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={cn(
                  'transition-all duration-300',
                  i === current ? 'w-8 h-0.5 bg-[#C6A66B]' : 'w-4 h-0.5 bg-white/30 hover:bg-white/60'
                )}
              />
            ))}
          </div>
          <button
            onClick={next}
            className="w-12 h-12 border border-white/20 flex items-center justify-center text-white hover:border-[#C6A66B] hover:text-[#C6A66B] transition-all duration-300"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </section>
  )
}
