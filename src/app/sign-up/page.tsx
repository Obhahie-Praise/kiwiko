import Image from 'next/image'
import React from 'react'

const SignUpPage = () => {
  return (
    <div className='flex justify-center my-10 min-h-screen'>
        <div className="absolute top-8 left-8">
            <Image src="/neutral-logo.svg" alt='logo' width={40} height={40} />
        </div>
        <div className="">
            <h1 className="text-4xl font-semibold bg-linear-to-b text-center from-zinc-300 to-zinc-700 bg-clip-text text-transparent">Let's get you started!</h1>
            <h2 className="text-xl font-medium text-center">How will you use kiwiko?</h2>
            <div className="">
                <div className="mt-30">
                    <h3 className="">I’m building a startup</h3>
                    <h3 className="">I’m looking to discover startups</h3>
                </div>
            </div>
        </div>
        
    </div>
  )
}

export default SignUpPage