"use client"
import { useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export function ProblemSection() {
  const containerRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    const sequence = gsap.utils.toArray('.problem-step')
    const lines = gsap.utils.toArray('.problem-line')

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top center",
        end: "bottom center",
        scrub: 1,
      }
    })

    sequence.forEach((step: any, i) => {
      tl.to(step, {
        opacity: 1,
        color: i === sequence.length - 1 ? "var(--color-accent)" : "var(--color-foreground)",
        duration: 1
      })
      if (lines[i]) {
        tl.to(lines[i], {
          height: 64,
          opacity: 1,
          duration: 0.5
        }, "<0.5")
      }
    })
  }, { scope: containerRef })

  return (
    <section className="min-h-screen py-64 flex flex-col items-center justify-center bg-background">
      <div className="max-w-6xl mx-auto px-4 text-center space-y-24" ref={containerRef}>
        <h2 className="editorial-heading text-muted">
          You don't have a time problem. <br className="hidden md:block" />
          <span className="text-foreground mt-8 block">You have an information problem.</span>
        </h2>
        
        <p className="editorial-body max-w-3xl mx-auto mt-24">
          YouTube contains thousands of hours of useful information, but finding the important parts can take longer than watching the video itself.
        </p>

        <div className="pt-48 flex flex-col items-center gap-8 text-lg font-medium tracking-[0.3em] text-muted">
          <div className="problem-step opacity-20">VIDEO</div>
          <div className="problem-line w-px h-0 bg-white/20 opacity-0"></div>
          <div className="problem-step opacity-20">TRANSCRIPT</div>
          <div className="problem-line w-px h-0 bg-white/20 opacity-0"></div>
          <div className="problem-step opacity-20">UNDERSTANDING</div>
          <div className="problem-line w-px h-0 bg-white/20 opacity-0"></div>
          <div className="problem-step opacity-20 transition-shadow">KNOWLEDGE</div>
        </div>
      </div>
    </section>
  )
}
