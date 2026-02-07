import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign In - Kiwiko',
  description: 'Sign in to your Kiwiko account to track your startup progress, connect with investors, and manage your projects.',
}

export default function SignInLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
