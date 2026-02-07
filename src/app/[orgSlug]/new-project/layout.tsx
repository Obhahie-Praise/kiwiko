import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Create New Project - Kiwiko',
  description: 'Start a new project in your organization. Set up your startup details, team, and begin tracking progress.',
}

export default function NewProjectLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
