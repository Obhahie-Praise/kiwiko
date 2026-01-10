import React from "react"
import MagneticCursor from "./Magnetic"

const cardStyle =
  "border border-zinc-300 bg-linear-to-b from-zinc-200/20 to-zinc-500/20 backdrop-blur-md rounded-full h-25 w-25 flex items-center justify-center text-sm font-medium text-zinc-600 absolute"

const FloatingCards = () => {
  return (
    <div className="relative mt-45 h-75">

      <MagneticCursor className={`${cardStyle} top-6 left-0`}>
        Venture Capitalists
      </MagneticCursor>

      <MagneticCursor className={`${cardStyle} -top-14 left-75`}>
        First Time Entrepreneurs
      </MagneticCursor>

      <MagneticCursor className={`${cardStyle} -top-20 left-1/2 -translate-x-1/2`}>
        Early Stage Startups
      </MagneticCursor>

      <MagneticCursor className={`${cardStyle} px-2 -top-14 right-75`}>
        Angel Investors
      </MagneticCursor>

      <MagneticCursor className={`${cardStyle} top-6 right-0`}>
        Lorem
      </MagneticCursor>

    </div>
  )
}

export default FloatingCards
