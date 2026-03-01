import React from "react";

const StatsSemiCircle = () => {
  return (
    <div className="absolute inset-x-0 bottom-0 -z-10 pointer-events-none flex justify-center items-end h-full">
      <div className="relative w-full max-w-[1400px] h-full flex justify-between px-10">
        {/* Left Side Arc */}
        <div className="absolute left-0 bottom-0 w-[800px] h-[800px] -translate-x-1/3 translate-y-1/2">
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full transform -rotate-45 opacity-60"
          >
            <defs>
              <linearGradient id="gradientLeft" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f97316" stopOpacity="0" />
                <stop offset="50%" stopColor="#fb923c" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#fb923c" stopOpacity="0" />
              </linearGradient>
              <filter id="blurLeft">
                <feGaussianBlur stdDeviation="1.5" />
              </filter>
            </defs>
            <circle
              cx="50"
              cy="50"
              r="48"
              fill="none"
              stroke="url(#gradientLeft)"
              strokeWidth="0.5"
              filter="url(#blurLeft)"
            />
          </svg>
        </div>

        {/* Right Side Arc */}
        <div className="absolute right-0 bottom-0 w-[800px] h-[800px] translate-x-1/3 translate-y-1/2">
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full transform rotate-45 opacity-60"
          >
            <defs>
              <linearGradient id="gradientRight" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#7c3aed" stopOpacity="0" />
                <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
              </linearGradient>
              <filter id="blurRight">
                <feGaussianBlur stdDeviation="1.5" />
              </filter>
            </defs>
            <circle
              cx="50"
              cy="50"
              r="48"
              fill="none"
              stroke="url(#gradientRight)"
              strokeWidth="0.5"
              filter="url(#blurRight)"
            />
          </svg>
        </div>
        
        {/* Secondary Vibrant Highlights (Orange) */}
        <div className="absolute left-1/4 bottom-1/4 w-[600px] h-[600px] -translate-x-1/2 translate-y-1/2">
          <svg viewBox="0 0 100 100" className="w-full h-full transform rotate-90 opacity-40">
            <circle
              cx="50"
              cy="50"
              r="48"
              fill="none"
              stroke="url(#gradientLeft)"
              strokeWidth="0.2"
              strokeDasharray="10 5"
              filter="url(#blurLeft)"
            />
          </svg>
        </div>

        {/* Center Glow behind everything */}
        <div className="absolute left-1/2 -translate-x-1/2 bottom-0 w-[1200px] h-[600px] bg-linear-to-t from-orange-50/20 to-transparent blur-[150px] -z-20 rounded-t-full" />
      </div>
    </div>
  );
};

export default StatsSemiCircle;