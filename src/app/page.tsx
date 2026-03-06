import Features from '@/components/sections/Features'
import Hero from '@/components/sections/Hero'
import Navbar from '@/components/sections/Navbar'
import React from 'react'
import Activity from '@/components/sections/Activity'
import Testimonials from '@/components/sections/Testimonials'
import Footer from '@/components/sections/Footer'
import { Metadata } from 'next'
import About from '@/components/sections/About'
import WaitlistPage from '@/components/waitlist/WaitlistPage'

export const metadata: Metadata = {
  title: 'Kiwiko - Track startup progress and connect with investors',
  description: 'A platform for founders to share their startup progress and for investors to discover high-momentum ventures. Track execution, verify traction, and connect with the right people.',
}

const HomePage = () => {
  const appMode = process.env.APP_MODE

  if (appMode === "waitlist") {
    return <WaitlistPage />
  }

  return (
    <div className='scroll-smooth'>
      <div className="relative">
        <Navbar />
        <Hero />
      </div>
      <main className="">
        <About />
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