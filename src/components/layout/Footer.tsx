'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Instagram, Facebook, Twitter, Music2, ArrowRight, Mail } from 'lucide-react'

const footerLinks = {
  Company: [
    { label: 'About Us', href: '/about' },
    { label: 'Careers', href: '/careers' },
    { label: 'Press & Media', href: '/press' },
    { label: 'Sustainability', href: '/sustainability' },
    { label: 'Store Locator', href: '/stores' },
  ],
  Help: [
    { label: 'FAQ', href: '/faq' },
    { label: 'Shipping & Delivery', href: '/shipping' },
    { label: 'Returns & Exchanges', href: '/returns' },
    { label: 'Size Guide', href: '/size-guide' },
    { label: 'Contact Us', href: '/contact' },
  ],
  Categories: [
    { label: 'Men', href: '/products?gender=men' },
    { label: 'Women', href: '/products?gender=women' },
    { label: 'Collections', href: '/collections' },
    { label: 'Brands', href: '/brands' },
    { label: 'Sale', href: '/products?sale=true' },
  ],
  Legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Cookie Policy', href: '/cookies' },
    { label: 'Seller Agreement', href: '/seller-agreement' },
  ],
}

const socialLinks = [
  { icon: Instagram, label: 'Instagram', href: '#' },
  { icon: Facebook, label: 'Facebook', href: '#' },
  { icon: Twitter, label: 'Twitter', href: '#' },
  { icon: Music2, label: 'TikTok', href: '#' },
]

const paymentMethods = ['Visa', 'Mastercard', 'GoPay', 'OVO', 'DANA', 'QRIS', 'Mandiri', 'BCA']

export default function Footer() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return
    setLoading(true)
    await new Promise(r => setTimeout(r, 1000))
    setSubscribed(true)
    setLoading(false)
    setEmail('')
  }

  return (
    <footer className="bg-[#111111] text-white">
      {/* Newsletter Section */}
      <div className="border-b border-white/10">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-16 py-12 md:py-16">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
              <h3 className="font-serif text-2xl md:text-3xl text-white mb-2">
                Join the <span className="text-[#C6A66B]">ÉLÉGANCE</span> Circle
              </h3>
              <p className="text-white/60 text-sm font-light">
                Subscribe for exclusive access to new arrivals, member-only offers & style inspiration.
              </p>
            </div>
            <div className="w-full md:w-auto md:min-w-[400px]">
              {subscribed ? (
                <div className="text-center md:text-left">
                  <p className="text-[#C6A66B] font-light tracking-wider">
                    ✓ Thank you for subscribing! Welcome to ÉLÉGANCE.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-0">
                  <div className="flex items-center flex-1 bg-white/5 border border-white/20 border-r-0">
                    <Mail size={16} className="ml-4 text-white/40 flex-shrink-0" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      className="flex-1 bg-transparent px-3 py-3.5 text-sm text-white placeholder-white/40 focus:outline-none"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-gold px-6 py-3.5 flex items-center gap-2 text-xs whitespace-nowrap"
                  >
                    {loading ? (
                      <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    ) : (
                      <>Subscribe <ArrowRight size={14} /></>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-16 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10 lg:gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link href="/" className="font-serif text-2xl tracking-[0.2em] text-white mb-4 block">
              <span className="text-[#C6A66B]">É</span>LÉGANCE
            </Link>
            <p className="text-white/50 text-sm font-light leading-relaxed mb-6 max-w-xs">
              Redefining the art of fashion. A curated marketplace for premium fashion pieces
              crafted for the modern connoisseur.
            </p>
            {/* Social Links */}
            <div className="flex items-center gap-3">
              {socialLinks.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 border border-white/20 flex items-center justify-center text-white/60 hover:border-[#C6A66B] hover:text-[#C6A66B] transition-all duration-300"
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Nav Columns */}
          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <h4 className="text-[#C6A66B] text-xs tracking-widest uppercase font-semibold mb-5">
                {heading}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-white/50 hover:text-white text-sm font-light transition-colors duration-200 hover:pl-1 block"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-16 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-white/40 text-xs font-light tracking-wider">
              © {new Date().getFullYear()} ÉLÉGANCE. All rights reserved. Made with love in Indonesia.
            </p>
            {/* Payment Methods */}
            <div className="flex items-center gap-2 flex-wrap justify-center">
              {paymentMethods.map((method) => (
                <span
                  key={method}
                  className="px-2 py-1 border border-white/15 text-white/40 text-[10px] font-medium tracking-wider rounded-sm"
                >
                  {method}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
