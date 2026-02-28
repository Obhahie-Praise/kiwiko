import React from 'react'

const StatsSemiCircle = () => {
  return (
    <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
        {/* Left Arc */}
        <div className="absolute -left-[10%] bottom-0 w-[600px] h-[600px] border-[1px] border-orange-500/20 rounded-full" 
             style={{ 
               clipPath: 'inset(0 0 0 50%)',
               transform: 'translateY(50%) rotate(-45deg)',
               filter: 'blur(0.5px)'
             }} 
        />
        
        {/* Right Arc */}
        <div className="absolute -right-[10%] bottom-0 w-[600px] h-[600px] border-[1px] border-purple-500/20 rounded-full" 
             style={{ 
               clipPath: 'inset(0 50% 0 0)',
               transform: 'translateY(50%) rotate(45deg)',
               filter: 'blur(0.5px)'
             }} 
        />

        {/* Subtle Glows */}
        <div className="absolute -left-[5%] bottom-0 w-[400px] h-[400px] bg-orange-200/20 blur-[120px] rounded-full" />
        <div className="absolute -right-[5%] bottom-0 w-[400px] h-[400px] bg-purple-200/10 blur-[120px] rounded-full" />
    </div>
  )
}

export default StatsSemiCircle