import Link from 'next/link'
import Image from 'next/image'

const offers = [
  {
    id: 1,
    title: 'Up to 40% Off\nSelected Styles',
    subtitle: 'Limited time — Shop the season&rsquo;s best deals',
    cta: 'Shop Sale',
    ctaLink: '/products?sale=true',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800',
    badge: 'Exclusive Sale',
    bgColor: '#111111',
  },
  {
    id: 2,
    title: 'New Member\nSpecial Offer',
    subtitle: 'Register today and get 15% off your first order',
    cta: 'Register Now',
    ctaLink: '/register',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
    badge: 'Welcome Gift',
    bgColor: '#1a1a2e',
  },
]

export default function ExclusiveOffers() {
  return (
    <section className="py-16 md:py-24 bg-[#F8F7F4]">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-16">
        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-[#C6A66B] text-xs tracking-[0.3em] uppercase font-light mb-3">Limited Time</p>
          <h2 className="font-serif text-3xl md:text-4xl text-[#111111] mb-4">Exclusive Offers</h2>
          <div className="section-divider" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {offers.map((offer) => (
            <div
              key={offer.id}
              className="relative overflow-hidden group"
              style={{ minHeight: '320px' }}
            >
              <Image
                src={offer.image}
                alt={offer.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/20" />

              {/* Content */}
              <div className="relative z-10 p-8 md:p-10 h-full flex flex-col justify-center">
                <span className="inline-block bg-[#C6A66B] text-black text-[10px] font-bold tracking-widest uppercase px-3 py-1.5 mb-5 w-fit">
                  {offer.badge}
                </span>
                <h3 className="font-serif text-3xl md:text-4xl text-white mb-3 leading-tight whitespace-pre-line">
                  {offer.title}
                </h3>
                <p className="text-white/70 text-sm font-light mb-6 max-w-xs" dangerouslySetInnerHTML={{ __html: offer.subtitle }} />
                <Link
                  href={offer.ctaLink}
                  className="btn-gold px-6 py-3 text-xs inline-flex items-center gap-2 w-fit"
                >
                  {offer.cta}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
