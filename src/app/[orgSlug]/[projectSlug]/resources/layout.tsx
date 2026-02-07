import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Resources - Kiwiko',
  description: 'Access guides, tools, and resources to help you build and grow your startup.',
}

export default function ResourcesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
