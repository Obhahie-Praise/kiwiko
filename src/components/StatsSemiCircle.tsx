import React from 'react'
import FloatingCards from './FloatingCards'

const StatsSemiCircle = () => {
  return (
    <div className="relative -z-20 mt-10">
        <div className="w-980 h-600 absolute top-10 left-1/2 -translate-x-1/2 bg-linear-to-r from-black via-zinc-200 to-black rounded-t-full"></div>
        <div className="w-1000 h-600 absolute top-10.5 left-1/2 -translate-x-1/2 bg-zinc-100 rounded-t-full"></div>
        <div className="-z-10 h-500 w-400 rounded-full absolute top-10 bg-zinc-400 left-1/2 top- -translate-x-1/2 blur-3xl"></div>
  {/*       <div className="-z-50 h-200 w-200 rounded-full absolute top-20 bg-lime-300 right-1/2 blur-3xl"></div>
        <div className="-z-50 h-200 w-200 rounded-full absolute top-20 bg-lime-300 left-1/2 blur-3xl"></div> */}
        <div className="h-200 w-200 bg-linear-to-r from-zinc-300 to-white/20 blur-2xl -z-10 absolute -top-110 -left-180 rotate-75"></div>
        <div className="h-200 w-200 bg-linear-to-l from-zinc-300 to-white/20 blur-2xl -z-10 absolute -top-110 -right-180 -rotate-75"></div>
    </div>
  )
}

export default StatsSemiCircle