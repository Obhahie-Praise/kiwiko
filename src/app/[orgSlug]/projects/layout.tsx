import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Projects - Kiwiko',
  description: 'View and manage all your organization projects. Track progress, monitor metrics, and organize your startup portfolio.',
}

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
