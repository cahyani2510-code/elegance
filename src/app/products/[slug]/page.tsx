import type { Metadata } from 'next'
import { mockProducts } from '@/data/mock'
import ProductDetailContent from '@/components/product/ProductDetailContent'
import { notFound } from 'next/navigation'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const product = mockProducts.find(p => p.slug === slug)
  if (!product) return { title: 'Product Not Found' }
  return {
    title: product.name,
    description: product.description.slice(0, 160),
    openGraph: {
      title: product.name,
      description: product.description.slice(0, 160),
      images: product.images[0] ? [{ url: product.images[0] }] : [],
    },
  }
}

export function generateStaticParams() {
  return mockProducts.map(p => ({ slug: p.slug }))
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params
  const product = mockProducts.find(p => p.slug === slug)
  if (!product) notFound()
  return <ProductDetailContent slug={slug} />
}
