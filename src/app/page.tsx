import Hero from '@/components/sections/Hero'
import Navbar from '@/components/sections/Navbar'
import React from 'react'
import dynamic from 'next/dynamic'
import { Metadata } from 'next'
import WaitlistPage from '@/components/waitlist/WaitlistPage'
import { ReactLenis } from "../utils/lenis";

const About = dynamic(() => import('@/components/sections/About'))
const Activity = dynamic(() => import('@/components/sections/Activity'))
const Features = dynamic(() => import('@/components/sections/Features'))
const Testimonials = dynamic(() => import('@/components/sections/Testimonials'))
const Footer = dynamic(() => import('@/components/sections/Footer'))

export const metadata: Metadata = {
  title: 'Kiwiko - Track startup progress and connect with investors',
  description: 'A platform for founders to share their startup progress and for investors to discover high-momentum ventures. Track execution, verify traction, and connect with the right people.',
}

const HomePage = () => {
  const appMode = process.env.NEXT_PUBLIC_APP_MODE

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