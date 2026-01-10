import Hero from '@/components/sections/Hero'
import Navbar from '@/components/sections/Navbar'
import React from 'react'

const HomePage = () => {
  return (
    <div className=''>
      <Navbar />
      <main className="mx-30">
        <Hero />
      </main>
    </div>
  )
}

export default HomePage