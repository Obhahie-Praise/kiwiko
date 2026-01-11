import Features from '@/components/sections/Features'
import Hero from '@/components/sections/Hero'
import Navbar from '@/components/sections/Navbar'
import React from 'react'
import Activity from '@/components/sections/Activity'
import Testimonials from '@/components/sections/Testimonials'
import Footer from '@/components/sections/Footer'

const HomePage = () => {
  return (
    <div className=''>
      <Navbar />
      <main className="mx-30">
        <Hero />
        <Activity />
        <Features />
        <Testimonials />
      </main>
      <footer>
        <Footer />
      </footer>
    </div>
  )
}

export default HomePage