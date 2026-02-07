import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Notifications - Kiwiko',
  description: 'Stay updated with notifications about your projects, investor activity, and team updates.',
}

export default function NotificationsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
