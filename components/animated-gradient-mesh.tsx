'use client'

import { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'

export function AnimatedGradientMesh() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight
    
    let time = 0
    let animationId: number
    
    const animate = () => {
      time += 0.001
      
      // Create gradient
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
      
      const hue1 = (time * 30) % 360
      const hue2 = (time * 30 + 120) % 360
      const hue3 = (time * 30 + 240) % 360
      
      gradient.addColorStop(0, `hsl(${hue1}, 100%, 50%)`)
      gradient.addColorStop(0.5, `hsl(${hue2}, 100%, 50%)`)
      gradient.addColorStop(1, `hsl(${hue3}, 100%, 50%)`)
      
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      // Add mesh deformation
      for (let i = 0; i < 3; i++) {
        const x = Math.sin(time * (0.3 + i * 0.1) + i * 2) * canvas.width * 0.3 + canvas.width * 0.5
        const y = Math.cos(time * (0.2 + i * 0.15) + i * 1.5) * canvas.height * 0.3 + canvas.height * 0.5
        const r = 300 + Math.sin(time * 0.5 + i) * 100
        
        const circleGradient = ctx.createRadialGradient(x, y, 0, x, y, r)
        circleGradient.addColorStop(0, `hsla(${(hue1 + hue2) / 2}, 100%, 50%, 0.3)`)
        circleGradient.addColorStop(1, `hsla(${(hue2 + hue3) / 2}, 100%, 50%, 0)`)
        
        ctx.fillStyle = circleGradient
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      }
      
      animationId = requestAnimationFrame(animate)
    }
    
    animate()
    
    return () => cancelAnimationFrame(animationId)
  }, [])
  
  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full opacity-40"
      style={{ mixBlendMode: 'screen' }}
    />
  )
}
