import type { Metadata } from 'next'
import AuthForm from '@/components/auth/AuthForm'

export const metadata: Metadata = {
  title: 'Sign In',
  description: 'Sign in to your ÉLÉGANCE account to manage orders, wishlist, and profile.',
}

export default function LoginPage() {
  return <AuthForm mode="login" />
}
