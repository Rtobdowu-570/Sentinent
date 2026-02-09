'use client'

import { motion } from 'framer-motion'
import { useEffect, useRef } from 'react'

interface AnimatedConnectionLinesProps {
  stepCount?: number
}

export function AnimatedConnectionLines({ stepCount = 3 }: AnimatedConnectionLinesProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  
  useEffect(() => {
    if (!svgRef.current) return
    
    // Update SVG dimensions
    const parent = svgRef.current.parentElement
    if (parent) {
      svgRef.current.setAttribute('width', parent.offsetWidth.toString())
      svgRef.current.setAttribute('height', parent.offsetHeight.toString())
    }
  }, [])
  
  return (
    <svg
      ref={svgRef}
      className="absolute top-0 left-0 w-full h-full"
      style={{ pointerEvents: 'none' }}
    >
      {/* Defs for animations */}
      <defs>
        <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(6, 182, 212, 0.5)" />
          <stop offset="50%" stopColor="rgba(168, 85, 247, 0.5)" />
          <stop offset="100%" stopColor="rgba(6, 182, 212, 0)" />
        </linearGradient>
        
        <filter id="glow">
          <feGaussianBlur stdDeviation="4" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      
      {/* Animated connecting lines with particles */}
      <g opacity="0.6">
        {[...Array(stepCount - 1)].map((_, i) => (
          <motion.g
            key={`line-${i}`}
            initial={{ opacity: 0, pathLength: 0 }}
            whileInView={{ opacity: 1, pathLength: 1 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.8, delay: 0.2 + i * 0.1 }}
          >
            {/* Main line */}
            <line
              x1={`${(i + 1) * (100 / stepCount)}%`}
              y1="50%"
              x2={`${(i + 2) * (100 / stepCount)}%`}
              y2="50%"
              stroke="url(#pathGradient)"
              strokeWidth="2"
              filter="url(#glow)"
              vectorEffect="non-scaling-stroke"
            />
            
            {/* Animated particle trail */}
            <motion.circle
              cx={`${(i + 1) * (100 / stepCount)}%`}
              cy="50%"
              r="6"
              fill="rgba(6, 182, 212, 0.8)"
              animate={{
                cx: [`${(i + 1) * (100 / stepCount)}%`, `${(i + 2) * (100 / stepCount)}%`],
              }}
              transition={{
                duration: 2,
                delay: 0.3 + i * 0.2,
                repeat: Infinity,
                ease: 'linear'
              }}
              filter="url(#glow)"
              vectorEffect="non-scaling-stroke"
            />
          </motion.g>
        ))}
      </g>
    </svg>
  )
}
