import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Inbox - Kiwiko',
  description: 'View messages from investors, partners, and other founders. Manage your communications in one place.',
}

export default function InboxLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
