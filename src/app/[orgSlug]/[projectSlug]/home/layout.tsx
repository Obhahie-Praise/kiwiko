import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dashboard - Kiwiko',
  description: 'Your project dashboard. View metrics, track progress, and manage your startup operations.',
}

export default function ProjectHomeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
