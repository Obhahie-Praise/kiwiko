import InboxLayout from '@/components/InboxLayout'
import React from 'react'

const InboxPage = ({ params }: { params: { orgSlug: string; projectSlug: string } }) => {
  return (
    <div className='bg-zinc-50'>
      <InboxLayout />
    </div>
  )
}

export default InboxPage