import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Discover - Kiwiko',
  description: 'Explore other startups and ventures. Find potential collaborators and see what others are building.',
}

export default function ProjectDiscoverLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
