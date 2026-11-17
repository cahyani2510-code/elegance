import type { Metadata } from 'next'
import AuthForm from '@/components/auth/AuthForm'

export const metadata: Metadata = {
  title: 'Create Account',
  description: 'Join ÉLÉGANCE to discover exclusive fashion collections, receive personal recommendations, and enjoy special perks.',
}

export default function RegisterPage() {
  return <AuthForm mode="register" />
}
