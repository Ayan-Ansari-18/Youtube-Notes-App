"use client"
import { ReactLenis } from 'lenis/react'
import { ReactNode, useEffect } from 'react'
import gsap from 'gsap'

export function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    gsap.ticker.add((time) => {
      window.scrollTo(window.scrollX, window.scrollY) // just to keep ticker active if needed, but lenis/react handles requestAnimationFrame.
    })
  }, [])
  
  return (
    <ReactLenis root options={{ lerp: 0.2, duration: 0.8, smoothWheel: true }}>
      {children}
    </ReactLenis>
  )
}
