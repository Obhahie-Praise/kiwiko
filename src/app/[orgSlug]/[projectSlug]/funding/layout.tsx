import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Funding - Kiwiko',
  description: 'Track funding rounds, manage investor relationships, and monitor your fundraising progress.',
}

export default function FundingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
