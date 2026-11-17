import { redirect } from 'next/navigation'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cahyani — Digital space',
  description: 'Portfolio pribadi Cahyani, mahasiswa Sistem Informasi di Universitas Pembangunan Jaya.',
}

export default function HomePage() {
  redirect('/portfolio.html')
}
