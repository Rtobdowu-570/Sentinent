'use client'

import { motion, useMotionTemplate, useMotionValue, useTransform } from 'framer-motion'
import { ReactNode, useRef } from 'react'

interface GlassmorphicCardProps {
  children: ReactNode
  delay?: number
  index?: number
  className?: string
}

export function GlassmorphicCard({ children, delay = 0, index = 0, className = '' }: GlassmorphicCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    
    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    mouseX.set(x)
    mouseY.set(y)
  }
  
  const rotateX = useTransform(mouseY, [0, 400], [15, -15])
  const rotateY = useTransform(mouseX, [0, 400], [-15, 15])
  
  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ scale: 1.05, y: -10 }}
      onMouseMove={handleMouseMove}
      className={`relative group cursor-pointer ${className}`}
      style={{
        perspective: 1200,
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
      } as any}
    >
      {/* Glassmorphic background */}
      <div className="absolute inset-0 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Particle trail effect on hover */}
      <motion.div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100"
        animate={{
          boxShadow: [
            '0 0 0px rgba(6, 182, 212, 0)',
            '0 0 30px rgba(6, 182, 212, 0.5)',
            '0 0 0px rgba(168, 85, 247, 0)',
          ]
        }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      
      {/* Content */}
      <div className="relative z-10 p-6">
        {children}
      </div>
    </motion.div>
  )
}
