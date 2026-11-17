'use client'

import { useState, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import { SlidersHorizontal, Grid3X3, List, X, ChevronDown, ChevronUp } from 'lucide-react'
import { mockProducts, mockCategories, mockBrands } from '@/data/mock'
import ProductCard from '@/components/product/ProductCard'
import { ProductCardSkeleton } from '@/components/ui/Skeleton'
import { Product, ProductFilter, SortOption } from '@/types'
import { formatPrice, cn } from '@/lib/utils'

const PRICE_RANGES = [
  { label: 'Under Rp 500K', min: 0, max: 500000 },
  { label: 'Rp 500K – 1JT', min: 500000, max: 1000000 },
  { label: 'Rp 1JT – 2.5JT', min: 1000000, max: 2500000 },
  { label: 'Rp 2.5JT – 5JT', min: 2500000, max: 5000000 },
  { label: 'Above Rp 5JT', min: 5000000, max: Infinity },
]

const SORT_OPTIONS: { label: string; value: SortOption }[] = [
  { label: 'Newest First', value: 'newest' },
  { label: 'Most Popular', value: 'popular' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Highest Rated', value: 'rating' },
]

function FilterSection({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border-b border-[#e5e1d8] pb-4 mb-4">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full py-2 text-sm font-medium text-[#111111] tracking-wider uppercase"
      >
        {title}
        {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
      {open && <div className="mt-3">{children}</div>}
    </div>
  )
}

export default function ProductsPageContent() {
  const searchParams = useSearchParams()
  const [filter, setFilter] = useState<ProductFilter>({})
  const [sort, setSort] = useState<SortOption>('newest')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false)
  const [priceRange, setPriceRange] = useState<{ min: number; max: number } | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>(searchParams.get('category') || '')
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [minRating, setMinRating] = useState<number>(0)

  const categoryParam = searchParams.get('category') || ''
  const searchParam = searchParams.get('search') || ''
  const saleParam = searchParams.get('sale') === 'true'

  const filteredProducts = useMemo<Product[]>(() => {
    let products = [...mockProducts]

    // Search
    if (searchParam) {
      const q = searchParam.toLowerCase()
      products = products.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags.some(t => t.includes(q)) ||
        p.brand?.name.toLowerCase().includes(q)
      )
    }

    // Category filter
    const catToFilter = selectedCategory || categoryParam
    if (catToFilter) {
      const cat = mockCategories.find(c => c.slug === catToFilter)
      if (cat) products = products.filter(p => p.category_id === cat.id)
    }

    // Brand filter
    if (selectedBrands.length > 0) {
      products = products.filter(p => p.brand && selectedBrands.includes(p.brand.slug))
    }

    // Price filter
    if (priceRange) {
      products = products.filter(p => p.price >= priceRange.min && p.price <= priceRange.max)
    }

    // Sale filter
    if (saleParam) {
      products = products.filter(p => p.original_price && p.original_price > p.price)
    }

    // Rating filter
    if (minRating > 0) {
      products = products.filter(p => p.rating >= minRating)
    }

    // Sorting
    switch (sort) {
      case 'newest': products.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()); break
      case 'popular': products.sort((a, b) => b.sold_count - a.sold_count); break
      case 'price_asc': products.sort((a, b) => a.price - b.price); break
      case 'price_desc': products.sort((a, b) => b.price - a.price); break
      case 'rating': products.sort((a, b) => b.rating - a.rating); break
    }

    return products
  }, [selectedCategory, categoryParam, selectedBrands, priceRange, saleParam, minRating, sort, searchParam])

  const toggleBrand = (slug: string) => {
    setSelectedBrands(prev =>
      prev.includes(slug) ? prev.filter(b => b !== slug) : [...prev, slug]
    )
  }

  const clearFilters = () => {
    setSelectedCategory('')
    setSelectedBrands([])
    setPriceRange(null)
    setMinRating(0)
  }

  const hasActiveFilters = selectedCategory || selectedBrands.length > 0 || priceRange || minRating > 0

  const FilterPanel = () => (
    <div className="bg-white p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-medium text-sm text-[#111111] tracking-widest uppercase">Filters</h3>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-xs text-[#C6A66B] hover:text-[#a8873d] flex items-center gap-1 transition-colors"
          >
            <X size={12} />
            Clear All
          </button>
        )}
      </div>

      {/* Category */}
      <FilterSection title="Category">
        <div className="space-y-2">
          <button
            onClick={() => setSelectedCategory('')}
            className={cn(
              'w-full text-left text-sm py-1.5 px-2 transition-colors font-light',
              !selectedCategory ? 'text-[#C6A66B] font-medium' : 'text-[#6b7280] hover:text-[#111111]'
            )}
          >
            All Categories
          </button>
          {mockCategories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.slug)}
              className={cn(
                'w-full text-left text-sm py-1.5 px-2 transition-colors font-light',
                selectedCategory === cat.slug ? 'text-[#C6A66B] font-medium bg-[#f8f7f4]' : 'text-[#6b7280] hover:text-[#111111] hover:bg-[#f8f7f4]'
              )}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Price Range */}
      <FilterSection title="Price Range">
        <div className="space-y-2">
          <button
            onClick={() => setPriceRange(null)}
            className={cn('w-full text-left text-sm py-1.5 px-2 font-light transition-colors',
              !priceRange ? 'text-[#C6A66B] font-medium' : 'text-[#6b7280] hover:text-[#111111]'
            )}
          >
            All Prices
          </button>
          {PRICE_RANGES.map(range => (
            <button
              key={range.label}
              onClick={() => setPriceRange({ min: range.min, max: range.max })}
              className={cn('w-full text-left text-sm py-1.5 px-2 font-light transition-colors',
                priceRange?.min === range.min && priceRange?.max === range.max
                  ? 'text-[#C6A66B] font-medium bg-[#f8f7f4]'
                  : 'text-[#6b7280] hover:text-[#111111] hover:bg-[#f8f7f4]'
              )}
            >
              {range.label}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Brand */}
      <FilterSection title="Brand">
        <div className="space-y-2">
          {mockBrands.map(brand => (
            <label key={brand.id} className="flex items-center gap-3 cursor-pointer group">
              <div
                onClick={() => toggleBrand(brand.slug)}
                className={cn(
                  'w-4 h-4 border flex items-center justify-center transition-all cursor-pointer',
                  selectedBrands.includes(brand.slug)
                    ? 'bg-[#C6A66B] border-[#C6A66B]'
                    : 'border-[#d1cec8] group-hover:border-[#C6A66B]'
                )}
              >
                {selectedBrands.includes(brand.slug) && (
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4L3.5 6.5L9 1" stroke="#111" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                )}
              </div>
              <span className="text-sm text-[#6b7280] group-hover:text-[#111111] font-light transition-colors">
                {brand.name}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Rating */}
      <FilterSection title="Minimum Rating" defaultOpen={false}>
        <div className="space-y-2">
          {[0, 3, 4, 4.5].map(rating => (
            <button
              key={rating}
              onClick={() => setMinRating(rating)}
              className={cn('w-full text-left text-sm py-1.5 px-2 font-light transition-colors',
                minRating === rating ? 'text-[#C6A66B] font-medium' : 'text-[#6b7280] hover:text-[#111111]'
              )}
            >
              {rating === 0 ? 'All Ratings' : `${rating}★ & Above`}
            </button>
          ))}
        </div>
      </FilterSection>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#F8F7F4]">
      {/* Page Header */}
      <div className="bg-[#111111] py-10 md:py-14">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-16 text-center">
          <p className="text-[#C6A66B] text-xs tracking-[0.3em] uppercase font-light mb-2">
            {searchParam ? 'Search Results' : saleParam ? 'Sale' : 'All Products'}
          </p>
          <h1 className="font-serif text-3xl md:text-4xl text-white">
            {searchParam ? `Results for "${searchParam}"` : saleParam ? 'Exclusive Sale' : 'Our Collection'}
          </h1>
          <p className="text-white/50 text-sm mt-3 font-light">{filteredProducts.length} products found</p>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-16 py-8">
        {/* Toolbar */}
        <div className="flex items-center justify-between gap-4 mb-6">
          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="lg:hidden flex items-center gap-2 border border-[#e5e1d8] bg-white px-4 py-2.5 text-sm text-[#111111] hover:border-[#C6A66B] transition-colors"
          >
            <SlidersHorizontal size={16} />
            Filters {hasActiveFilters && <span className="bg-[#C6A66B] text-black text-xs px-1.5 rounded-full">!</span>}
          </button>

          <div className="flex items-center gap-4 ml-auto">
            {/* Sort */}
            <div className="relative">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortOption)}
                className="appearance-none bg-white border border-[#e5e1d8] px-4 py-2.5 pr-8 text-sm text-[#111111] focus:border-[#C6A66B] transition-colors cursor-pointer"
              >
                {SORT_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#6b7280]" />
            </div>

            {/* View Mode */}
            <div className="hidden md:flex border border-[#e5e1d8] bg-white">
              <button
                onClick={() => setViewMode('grid')}
                className={cn('p-2.5 transition-colors', viewMode === 'grid' ? 'bg-[#111111] text-white' : 'text-[#6b7280] hover:text-[#111111]')}
              >
                <Grid3X3 size={16} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={cn('p-2.5 transition-colors', viewMode === 'list' ? 'bg-[#111111] text-white' : 'text-[#6b7280] hover:text-[#111111]')}
              >
                <List size={16} />
              </button>
            </div>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <FilterPanel />
          </aside>

          {/* Products */}
          <div className="flex-1 min-w-0">
            {filteredProducts.length === 0 ? (
              <div className="bg-white p-12 text-center">
                <div className="w-20 h-20 bg-[#f0ede8] rounded-full flex items-center justify-center mx-auto mb-4">
                  <SlidersHorizontal size={28} className="text-[#6b7280]" />
                </div>
                <h3 className="font-serif text-xl text-[#111111] mb-2">No products found</h3>
                <p className="text-[#6b7280] text-sm font-light mb-4">Try adjusting your filters or search term</p>
                <button onClick={clearFilters} className="btn-gold px-6 py-3 text-xs">
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className={cn(
                viewMode === 'grid'
                  ? 'grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6'
                  : 'flex flex-col gap-4'
              )}>
                {filteredProducts.map(product => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    variant={viewMode === 'list' ? 'horizontal' : 'default'}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      <>
        <div
          className={cn(
            'fixed inset-0 bg-black/60 z-50 lg:hidden transition-opacity duration-300',
            isMobileFilterOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          )}
          onClick={() => setIsMobileFilterOpen(false)}
        />
        <div className={cn(
          'fixed top-0 left-0 h-full w-80 max-w-[85vw] z-50 lg:hidden transition-transform duration-400 overflow-y-auto',
          isMobileFilterOpen ? 'translate-x-0' : '-translate-x-full'
        )}>
          <div className="bg-white h-full">
            <div className="flex items-center justify-between p-5 border-b border-[#e5e1d8]">
              <span className="font-medium text-sm tracking-widest uppercase">Filters</span>
              <button onClick={() => setIsMobileFilterOpen(false)} className="text-[#6b7280] hover:text-[#111111]">
                <X size={20} />
              </button>
            </div>
            <div className="p-5">
              <FilterPanel />
            </div>
            <div className="p-5 border-t border-[#e5e1d8]">
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="btn-gold w-full py-3.5 text-xs"
              >
                Apply Filters ({filteredProducts.length} results)
              </button>
            </div>
          </div>
        </div>
      </>
    </div>
  )
}
