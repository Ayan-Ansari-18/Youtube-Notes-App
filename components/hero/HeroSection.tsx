"use client"
import { useRef } from "react"
import { UrlInput } from "./UrlInput"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"
import Image from "next/image"

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const bgRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    const tl = gsap.timeline()
    
    tl.fromTo(".hero-title", { opacity: 0, y: 80 }, { opacity: 1, y: 0, duration: 1.8, ease: "power4.out" })
      .fromTo(".hero-desc", { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1.8, ease: "power4.out" }, "-=1.4")
      .fromTo(".hero-input", { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1.8, ease: "power4.out" }, "-=1.4")

    // Parallax background
    gsap.to(bgRef.current, {
      yPercent: 30,
      ease: "none",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true
      }
    })

  }, { scope: containerRef })

  return (
    <section ref={containerRef} className="relative h-[100svh] min-h-[800px] flex flex-col items-center justify-center overflow-hidden">
      {/* Cinematic Parallax Background */}
      <div ref={bgRef} className="absolute inset-[-10%] z-0 h-[120%] w-[120%] pointer-events-none">
        <Image 
          src="/hero-bg.png" 
          alt="Cinematic background" 
          fill 
          priority
          className="object-cover opacity-50"
        />
        {/* Gradient overlay to fade into background at bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background"></div>
        <div className="absolute inset-0 bg-gradient-to-l from-background via-transparent to-background"></div>
      </div>

      <div className="container relative z-10 mx-auto px-4 text-center mt-12">
        <h1 className="hero-title opacity-0 editorial-heading max-w-6xl mx-auto mb-8">
          Turn Videos <br />
          <span className="text-foreground/90">into knowledge.</span>
        </h1>
        
        <p className="hero-desc opacity-0 editorial-body max-w-2xl mx-auto mb-16">
          Paste a video link. Let AI turn it into clear summaries, structured notes and insights.
        </p>

        <div className="hero-input opacity-0 w-full max-w-3xl mx-auto">
          <UrlInput />
        </div>
      </div>
    </section>
  )
}
