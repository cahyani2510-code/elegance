'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react'
import { heroSlides } from '@/data/mock'
import { cn } from '@/lib/utils'

export default function HeroSection() {
  const [current, setCurrent] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const goTo = useCallback((index: number) => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setCurrent(index)
    setTimeout(() => setIsTransitioning(false), 700)
  }, [isTransitioning])

  const next = useCallback(() => {
    goTo((current + 1) % heroSlides.length)
  }, [current, goTo])

  const prev = useCallback(() => {
    goTo((current - 1 + heroSlides.length) % heroSlides.length)
  }, [current, goTo])

  useEffect(() => {
    const interval = setInterval(next, 6000)
    return () => clearInterval(interval)
  }, [next])

  const slide = heroSlides[current]

  return (
    <section className="relative h-[85vh] min-h-[600px] max-h-[900px] overflow-hidden bg-[#111111]">
      {/* Background Images */}
      {heroSlides.map((s, i) => (
        <div
          key={s.id}
          className={cn(
            'absolute inset-0 transition-opacity duration-700',
            i === current ? 'opacity-100' : 'opacity-0'
          )}
        >
          <Image
            src={s.image}
            alt={s.title}
            fill
            priority={i === 0}
            className="object-cover object-center"
            sizes="100vw"
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        </div>
      ))}

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-16 w-full">
          <div className="max-w-2xl">
            {/* Badge */}
            <div
              key={`badge-${current}`}
              className="inline-flex items-center gap-2 mb-6 animate-slide-in-left"
            >
              <div className="w-8 h-px bg-[#C6A66B]" />
              <span className="text-[#C6A66B] text-xs tracking-[0.3em] uppercase font-light">
                {slide.badge}
              </span>
            </div>

            {/* Title */}
            <h1
              key={`title-${current}`}
              className="font-serif text-5xl md:text-6xl lg:text-7xl text-white mb-6 leading-[1.1] animate-fade-in whitespace-pre-line"
            >
              {slide.title}
            </h1>

            {/* Subtitle */}
            <p
              key={`sub-${current}`}
              className="text-white/70 text-base md:text-lg font-light leading-relaxed mb-8 max-w-lg animate-fade-in"
              style={{ animationDelay: '0.2s' }}
            >
              {slide.subtitle}
            </p>

            {/* CTAs */}
            <div
              key={`cta-${current}`}
              className="flex flex-col sm:flex-row items-start gap-4 animate-fade-in"
              style={{ animationDelay: '0.3s' }}
            >
              <Link
                href={slide.ctaLink}
                className="btn-gold px-8 py-4 text-xs inline-flex items-center gap-2 group"
              >
                {slide.cta}
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/collections"
                className="btn-outline-gold px-8 py-4 text-xs inline-flex items-center gap-2 border-white/40 text-white hover:bg-white hover:text-[#111111]"
              >
                View Collections
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prev}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 border border-white/30 flex items-center justify-center text-white hover:border-[#C6A66B] hover:text-[#C6A66B] transition-all duration-300 backdrop-blur-sm bg-black/20"
        aria-label="Previous slide"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={next}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 border border-white/30 flex items-center justify-center text-white hover:border-[#C6A66B] hover:text-[#C6A66B] transition-all duration-300 backdrop-blur-sm bg-black/20"
        aria-label="Next slide"
      >
        <ChevronRight size={20} />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
        {heroSlides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={cn(
              'transition-all duration-300',
              i === current
                ? 'w-8 h-0.5 bg-[#C6A66B]'
                : 'w-4 h-0.5 bg-white/40 hover:bg-white/70'
            )}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      {/* Slide Counter */}
      <div className="absolute bottom-8 right-8 md:right-16 z-20 text-white/60 text-xs tracking-widest font-light">
        {String(current + 1).padStart(2, '0')} / {String(heroSlides.length).padStart(2, '0')}
      </div>
    </section>
  )
}
