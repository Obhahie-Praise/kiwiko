import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Create New Organization - Kiwiko',
  description: 'Create a new organization to manage multiple projects and collaborate with your team.',
}

export default function NewOrgLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
