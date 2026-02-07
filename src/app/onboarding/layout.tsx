import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Create Account - Kiwiko',
  description: 'Join Kiwiko to share your startup journey, track progress, and connect with investors who want to see real execution.',
}

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
