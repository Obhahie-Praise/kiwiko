'use client'

import React, { useRef, useEffect } from "react"
import { motion, useMotionValue, useSpring } from "framer-motion"

type MagneticCursorProps = {
  children: React.ReactNode
  className?: string
}

export default function MagneticCursor({
  children,
  className = "",
}: MagneticCursorProps) {
  const ref = useRef<HTMLDivElement>(null)

  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const springX = useSpring(x, { stiffness: 200, damping: 20 })
  const springY = useSpring(y, { stiffness: 200, damping: 20 })

  useEffect(() => {
    const move = (e: MouseEvent) => {
      if (!ref.current) return

      const rect = ref.current.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2

      const dx = e.clientX - cx
      const dy = e.clientY - cy

      const dist = Math.sqrt(dx * dx + dy * dy)
      const max = 120

      if (dist < max) {
        const s = 1 - dist / max
        x.set(dx * s * 0.45)
        y.set(dy * s * 0.45)
      } else {
        x.set(0)
        y.set(0)
      }
    }

    window.addEventListener("mousemove", move)
    return () => window.removeEventListener("mousemove", move)
  }, [])

  return (
    <motion.div
      ref={ref}
      style={{ x: springX, y: springY }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
