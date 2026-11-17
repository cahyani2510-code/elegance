import Link from 'next/link'
import { Truck, RotateCcw, Shield, Headphones } from 'lucide-react'

const features = [
  {
    icon: Truck,
    title: 'Free Shipping',
    desc: 'On all orders over Rp 500.000',
    link: '/shipping'
  },
  {
    icon: RotateCcw,
    title: 'Easy Returns',
    desc: 'Hassle-free 30-day return policy',
    link: '/returns'
  },
  {
    icon: Shield,
    title: 'Authentic Guarantee',
    desc: '100% genuine premium products',
    link: '/about'
  },
  {
    icon: Headphones,
    title: 'Premium Support',
    desc: 'Dedicated customer care team',
    link: '/contact'
  },
]

export default function FeaturesBanner() {
  return (
    <section className="border-y border-[#e5e1d8] bg-[#F8F7F4]">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-16">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-[#e5e1d8]">
          {features.map(({ icon: Icon, title, desc, link }) => (
            <Link
              key={title}
              href={link}
              className="flex flex-col items-center text-center px-4 py-8 md:py-10 group hover:bg-white transition-colors duration-200"
            >
              <div className="w-12 h-12 border border-[#e5e1d8] flex items-center justify-center mb-3 group-hover:border-[#C6A66B] transition-colors">
                <Icon size={20} className="text-[#C6A66B]" />
              </div>
              <h4 className="font-medium text-[#111111] text-sm mb-1">{title}</h4>
              <p className="text-xs text-[#6b7280] font-light">{desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
