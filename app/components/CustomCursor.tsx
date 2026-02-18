// Custom cursor component
'use client'

import React, { useState, useEffect } from 'react'

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)

  useEffect(() => {
    const updatePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY })
    }

    const handleMouseOver = (e: Event) => {
      const target = e.target as HTMLElement
      if (target.tagName === 'A' || target.tagName === 'BUTTON' || target.classList.contains('cursor-pointer')) {
        setIsHovering(true)
      } else {
        setIsHovering(false)
      }
    }

    const handleMouseOut = () => {
      setIsHovering(false)
    }

    window.addEventListener('mousemove', updatePosition)
    document.addEventListener('mouseover', handleMouseOver)
    document.addEventListener('mouseout', handleMouseOut)

    return () => {
      window.removeEventListener('mousemove', updatePosition)
      document.removeEventListener('mouseover', handleMouseOver)
      document.removeEventListener('mouseout', handleMouseOut)
    }
  }, [])

  return (
    <>
      <div 
        className="fixed top-0 left-0 w-6 h-6 bg-accent-v rounded-full pointer-events-none z-50 mix-blend-difference transition-transform duration-100 ease-out"
        style={{
          transform: `translate(${position.x - 12}px, ${position.y - 12}px) scale(${isHovering ? 1.5 : 1})`,
          transition: 'transform 0.1s ease-out'
        }}
      />
      <div 
        className="fixed top-0 left-0 w-12 h-12 border-2 border-accent-v rounded-full pointer-events-none z-50 transition-[transform,opacity] duration-200 ease-out"
        style={{
          transform: `translate(${position.x - 24}px, ${position.y - 24}px) scale(${isHovering ? 1 : 0})`,
          opacity: isHovering ? 0.3 : 0
        }}
      />
    </>
  )
}

export default CustomCursor
