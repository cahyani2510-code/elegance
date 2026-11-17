import { Suspense } from 'react'
import type { Metadata } from 'next'
import ProductsPageContent from '@/components/product/ProductsPageContent'

export const metadata: Metadata = {
  title: 'All Products',
  description: 'Browse our complete collection of premium fashion items including shirts, jackets, shoes, bags, and accessories.',
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F8F7F4]" />}>
      <ProductsPageContent />
    </Suspense>
  )
}
