import InboxLayout from '@/components/InboxLayout'
import React from 'react'

const InboxPage = () => {
  return (
    <div className=''>
      <nav className="px-3 py-2 flex items-center justify-between w-full">
        <h1 className="text-xl uppercase font-bold italic text-zinc-900">Inbox</h1>
      </nav>
      <InboxLayout />
    </div>
  )
}

export default InboxPage