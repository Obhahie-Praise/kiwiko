import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Discover Startups - Kiwiko',
  description: 'Explore high-momentum startups, filter by niche, and discover founders shipping real products. See verified traction and funding data.',
}

export default function DiscoverLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
