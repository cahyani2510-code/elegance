'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Search, ShoppingBag, Heart, User, Menu, X, ChevronDown } from 'lucide-react'
import { useCartStore, useWishlistStore, useUIStore, useAuthStore } from '@/store'
import { cn } from '@/lib/utils'

const navLinks = [
  { label: 'Home', href: '/' },
  {
    label: 'Men', href: '/products?gender=men',
    children: [
      { label: 'Kemeja Pria', href: '/products?category=kemeja-pria' },
      { label: 'Kaos Premium', href: '/products?category=kaos-premium' },
      { label: 'Celana Formal', href: '/products?category=celana-formal' },
      { label: 'Celana Casual', href: '/products?category=celana-casual' },
      { label: 'Jaket & Outerwear', href: '/products?category=jaket-outerwear' },
      { label: 'Sepatu Pria', href: '/products?category=sepatu&gender=men' },
    ]
  },
  {
    label: 'Women', href: '/products?gender=women',
    children: [
      { label: 'Kemeja Wanita', href: '/products?category=kemeja-wanita' },
      { label: 'Blouse & Tops', href: '/products?category=blouse' },
      { label: 'Celana Wanita', href: '/products?category=celana-casual&gender=women' },
      { label: 'Tas Wanita', href: '/products?category=tas' },
      { label: 'Sepatu Wanita', href: '/products?category=sepatu&gender=women' },
      { label: 'Aksesori', href: '/products?category=aksesori' },
    ]
  },
  {
    label: 'Collections', href: '/collections',
    children: [
      { label: 'New Arrivals', href: '/products?sort=newest' },
      { label: 'Best Sellers', href: '/products?sort=popular' },
      { label: 'The Office Edit', href: '/products?collection=office' },
      { label: 'Weekend Luxe', href: '/products?collection=weekend' },
      { label: 'Evening Affair', href: '/products?collection=evening' },
    ]
  },
  {
    label: 'Brands', href: '/brands',
    children: [
      { label: 'Maison Noir', href: '/brands/maison-noir' },
      { label: 'Casa Milano', href: '/brands/casa-milano' },
      { label: 'The Artisan', href: '/brands/the-artisan' },
      { label: 'Noire Studio', href: '/brands/noire-studio' },
      { label: 'Aurum Label', href: '/brands/aurum-label' },
    ]
  },
  { label: 'Sale', href: '/products?sale=true', isAccent: true },
]

export default function Navbar() {
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [openMobileSubmenu, setOpenMobileSubmenu] = useState<string | null>(null)

  const cartItems = useCartStore((s) => s.items)
  const wishlistItems = useWishlistStore((s) => s.items)
  const user = useAuthStore((s) => s.user)
  const setCartOpen = useUIStore((s) => s.setCartOpen)

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)
  const wishlistCount = wishlistItems.length

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setIsMobileOpen(false)
  }, [pathname])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchQuery.trim())}`
      setIsSearchOpen(false)
      setSearchQuery('')
    }
  }

  return (
    <>
      {/* Announcement Bar */}
      <div className="bg-[#111111] text-center py-2 px-4 z-50 relative">
        <p className="text-xs tracking-widest text-[#C6A66B] font-light uppercase">
          Free shipping on orders above Rp 500.000&nbsp;&nbsp;|&nbsp;&nbsp;Use code <span className="font-semibold">ELEGANCE10</span> for 10% off
        </p>
      </div>

      {/* Main Navbar */}
      <header
        className={cn(
          'sticky top-0 z-40 transition-all duration-500',
          isScrolled
            ? 'bg-[rgba(17,17,17,0.95)] backdrop-blur-xl border-b border-[#C6A66B]/20 shadow-luxury'
            : 'bg-[#111111]'
        )}
      >
        <nav className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-16">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-white p-2"
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              aria-label="Toggle menu"
            >
              {isMobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

            {/* Logo */}
            <Link
              href="/"
              className="absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0 font-serif text-white text-2xl md:text-3xl tracking-[0.2em] hover:opacity-80 transition-opacity"
            >
              <span className="text-[#C6A66B]">É</span>LÉGANCE
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1 lg:gap-2 mx-8">
              {navLinks.map((link) => (
                <div
                  key={link.label}
                  className="relative group"
                  onMouseEnter={() => setOpenDropdown(link.label)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <Link
                    href={link.href}
                    className={cn(
                      'flex items-center gap-1 px-3 py-2 text-xs tracking-widest uppercase font-light transition-colors duration-200',
                      link.isAccent
                        ? 'text-[#C6A66B] hover:text-[#d4b98a]'
                        : pathname === link.href
                        ? 'text-[#C6A66B]'
                        : 'text-white/80 hover:text-white'
                    )}
                  >
                    {link.label}
                    {link.children && <ChevronDown size={12} className="mt-0.5 transition-transform group-hover:rotate-180" />}
                  </Link>

                  {/* Dropdown */}
                  {link.children && (
                    <div className={cn(
                      'absolute top-full left-0 mt-0 bg-[#111111] border border-[#C6A66B]/20 min-w-[200px] shadow-luxury-lg transition-all duration-200',
                      openDropdown === link.label ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'
                    )}>
                      {link.children.map((child) => (
                        <Link
                          key={child.label}
                          href={child.href}
                          className="block px-5 py-3 text-xs tracking-wider text-white/70 hover:text-[#C6A66B] hover:bg-white/5 uppercase font-light transition-colors border-b border-white/5 last:border-0"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Right Icons */}
            <div className="flex items-center gap-1 md:gap-2">
              {/* Search */}
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2 text-white/70 hover:text-[#C6A66B] transition-colors"
                aria-label="Search"
              >
                <Search size={20} />
              </button>

              {/* Wishlist */}
              <Link href="/wishlist" className="relative p-2 text-white/70 hover:text-[#C6A66B] transition-colors">
                <Heart size={20} />
                {wishlistCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 bg-[#C6A66B] text-black text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {wishlistCount > 9 ? '9+' : wishlistCount}
                  </span>
                )}
              </Link>

              {/* Account */}
              <Link
                href={user ? '/dashboard' : '/login'}
                className="hidden md:flex p-2 text-white/70 hover:text-[#C6A66B] transition-colors"
                aria-label="Account"
              >
                <User size={20} />
              </Link>

              {/* Cart */}
              <button
                onClick={() => setCartOpen(true)}
                className="relative p-2 text-white/70 hover:text-[#C6A66B] transition-colors"
                aria-label="Cart"
              >
                <ShoppingBag size={20} />
                {cartCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 bg-[#C6A66B] text-black text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center animate-pulse-gold">
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Search Bar Dropdown */}
          <div className={cn(
            'overflow-hidden transition-all duration-300',
            isSearchOpen ? 'max-h-20 opacity-100 pb-4' : 'max-h-0 opacity-0'
          )}>
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for products, brands, categories..."
                className="w-full bg-white/10 border border-[#C6A66B]/30 text-white placeholder-white/40 px-4 py-3 pr-12 text-sm focus:border-[#C6A66B] transition-colors"
                autoFocus={isSearchOpen}
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#C6A66B] hover:text-white transition-colors"
              >
                <Search size={18} />
              </button>
            </form>
          </div>
        </nav>
      </header>

      {/* Mobile Drawer */}
      <>
        <div
          className={cn(
            'fixed inset-0 bg-black/60 z-50 md:hidden transition-opacity duration-300',
            isMobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          )}
          onClick={() => setIsMobileOpen(false)}
        />
        <div className={cn(
          'fixed top-0 left-0 h-full w-80 max-w-[85vw] bg-[#111111] z-50 md:hidden transition-transform duration-400 overflow-y-auto',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}>
          <div className="flex items-center justify-between p-5 border-b border-white/10">
            <span className="font-serif text-white text-xl tracking-widest">
              <span className="text-[#C6A66B]">É</span>LÉGANCE
            </span>
            <button onClick={() => setIsMobileOpen(false)} className="text-white/70 hover:text-white">
              <X size={22} />
            </button>
          </div>

          <div className="p-5">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="relative mb-6">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full bg-white/10 border border-white/20 text-white placeholder-white/40 px-4 py-3 pr-10 text-sm"
              />
              <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-[#C6A66B]">
                <Search size={16} />
              </button>
            </form>

            {/* Mobile Nav Links */}
            <nav className="space-y-1">
              {navLinks.map((link) => (
                <div key={link.label}>
                  <div className="flex items-center justify-between">
                    <Link
                      href={link.href}
                      className={cn(
                        'flex-1 py-3 text-sm tracking-wider uppercase font-light transition-colors',
                        link.isAccent ? 'text-[#C6A66B]' : 'text-white/80 hover:text-[#C6A66B]'
                      )}
                    >
                      {link.label}
                    </Link>
                    {link.children && (
                      <button
                        onClick={() => setOpenMobileSubmenu(openMobileSubmenu === link.label ? null : link.label)}
                        className="p-2 text-white/50 hover:text-white"
                      >
                        <ChevronDown
                          size={16}
                          className={cn('transition-transform', openMobileSubmenu === link.label && 'rotate-180')}
                        />
                      </button>
                    )}
                  </div>

                  {link.children && openMobileSubmenu === link.label && (
                    <div className="pl-4 pb-2 space-y-1 border-l border-[#C6A66B]/30 ml-2">
                      {link.children.map((child) => (
                        <Link
                          key={child.label}
                          href={child.href}
                          className="block py-2 text-xs tracking-wider text-white/60 hover:text-[#C6A66B] uppercase transition-colors"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                  <div className="border-b border-white/5" />
                </div>
              ))}
            </nav>

            {/* Mobile Footer Links */}
            <div className="mt-8 flex flex-col gap-3">
              <Link
                href={user ? '/dashboard' : '/login'}
                className="flex items-center gap-3 text-white/70 hover:text-[#C6A66B] transition-colors text-sm"
              >
                <User size={18} />
                {user ? 'My Account' : 'Login / Register'}
              </Link>
              <Link
                href="/wishlist"
                className="flex items-center gap-3 text-white/70 hover:text-[#C6A66B] transition-colors text-sm"
              >
                <Heart size={18} />
                Wishlist {wishlistCount > 0 && <span className="text-[#C6A66B]">({wishlistCount})</span>}
              </Link>
              <button
                onClick={() => { setCartOpen(true); setIsMobileOpen(false) }}
                className="flex items-center gap-3 text-white/70 hover:text-[#C6A66B] transition-colors text-sm"
              >
                <ShoppingBag size={18} />
                Cart {cartCount > 0 && <span className="text-[#C6A66B]">({cartCount})</span>}
              </button>
            </div>
          </div>
        </div>
      </>
    </>
  )
}
