'use client'

import { useRef, useMemo, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface ParticleFieldProps {
  count?: number
  speed?: number
  color1?: string
  color2?: string
}

function Particles({ count = 300, speed = 0.5, color1 = '#06b6d4', color2 = '#a855f7' }: ParticleFieldProps) {
  const pointsRef = useRef<THREE.Points>(null)
  const particlesData = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const velocities = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    
    const col1 = new THREE.Color(color1)
    const col2 = new THREE.Color(color2)
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      
      // Position in a sphere
      const r = Math.random() * 8
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(Math.random() * 2 - 1)
      
      positions[i3] = r * Math.sin(phi) * Math.cos(theta)
      positions[i3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      positions[i3 + 2] = r * Math.cos(phi)
      
      // Velocity
      velocities[i3] = (Math.random() - 0.5) * speed
      velocities[i3 + 1] = (Math.random() - 0.5) * speed
      velocities[i3 + 2] = (Math.random() - 0.5) * speed
      
      // Color gradient
      const t = Math.random()
      const color = col1.clone().lerp(col2, t)
      colors[i3] = color.r
      colors[i3 + 1] = color.g
      colors[i3 + 2] = color.b
    }
    
    return { positions, velocities, colors }
  }, [count, speed, color1, color2])
  
  useFrame(() => {
    if (!pointsRef.current) return
    
    const positions = pointsRef.current.geometry.attributes.position.array as Float32Array
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      
      // Update position
      positions[i3] += particlesData.velocities[i3]
      positions[i3 + 1] += particlesData.velocities[i3 + 1]
      positions[i3 + 2] += particlesData.velocities[i3 + 2]
      
      // Boundary wrapping
      if (Math.abs(positions[i3]) > 10) particlesData.velocities[i3] *= -1
      if (Math.abs(positions[i3 + 1]) > 10) particlesData.velocities[i3 + 1] *= -1
      if (Math.abs(positions[i3 + 2]) > 10) particlesData.velocities[i3 + 2] *= -1
    }
    
    pointsRef.current.geometry.attributes.position.needsUpdate = true
  })
  
  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={particlesData.positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={particlesData.colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.1}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
      />
    </points>
  )
}

export function ParticleField(props: ParticleFieldProps) {
  return (
    <div className="absolute inset-0 w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 15], fov: 75 }}
        style={{ background: 'transparent' }}
        gl={{ transparent: true, antialias: true }}
      >
        <Particles {...props} />
      </Canvas>
    </div>
  )
}
