'use client'

import { motion, useMotionValue, useTransform, animate } from 'framer-motion'
import { useEffect } from 'react'

interface AnimatedCounterProps {
  from?: number
  to: number
  duration?: number
  delay?: number
  suffix?: string
}

export function AnimatedCounter({ from = 0, to, duration = 2, delay = 0, suffix = '' }: AnimatedCounterProps) {
  const count = useMotionValue(from)
  const rounded = useTransform(count, latest => {
    if (typeof latest === 'number') {
      return Math.floor(latest).toString() + suffix
    }
    return suffix
  })
  
  useEffect(() => {
    const timeout = setTimeout(() => {
      const animation = animate(count, to, {
        duration,
        ease: 'easeOut',
        type: 'tween'
      })
      return () => animation.stop()
    }, delay * 1000)
    
    return () => clearTimeout(timeout)
  }, [count, to, duration, delay])
  
  return <motion.span>{rounded}</motion.span>
}
