import React from 'react'

const TopHeaderLights = () => {
  return (
    <div className='relative min-w-screen -z-50'>
        <div className='absolute -top-100 left-1/2 -translate-x-1/2 h-200 w-100 bg-linear-to-b from-orange-300/40 to-orange-400/40 blur-[250px] rounded-[120%] -z-10' />
        {/* <div className='absolute top-0 left-700 h-250 w-30 bg-linear-to-b from-blue-300/30 to-orange-400/30 -rotate-20 blur-xl ' />
        <div className='absolute top-0 left-100 h-180 w-30 bg-linear-to-b from-blue-300/30 to-orange-400/30 -rotate-20 blur-xl ' /> */}
    </div>
  )
}

export default TopHeaderLights