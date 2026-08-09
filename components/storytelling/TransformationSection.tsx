"use client"
import { useRef } from "react"
import { PlaySquare } from "lucide-react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export function TransformationSection() {
  const containerRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top center",
        end: "bottom center",
        scrub: 1,
      }
    })

    tl.to(".video-progress", { width: "100%", ease: "none" }, 0)

    const notes = gsap.utils.toArray('.ai-note')
    gsap.set(notes, { opacity: 0.1, y: 20 })

    tl.to(notes, {
      opacity: 1,
      y: 0,
      stagger: 0.2,
      ease: "power2.out",
    }, 0)
    
  }, { scope: containerRef })

  return (
    <section className="py-48 md:py-64 min-h-[120vh] flex items-center bg-[#020202]">
      <div ref={containerRef} className="grid lg:grid-cols-2 gap-24 lg:gap-32 items-center w-full max-w-[1400px] mx-auto px-4 md:px-8">
        
        {/* Left Side: Video */}
        <div className="flex flex-col space-y-12 order-2 lg:order-1">
          <div className="aspect-video bg-black/50 border border-white/5 flex items-center justify-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-tr from-accent/5 to-transparent opacity-50"></div>
            <PlaySquare className="w-24 h-24 text-white/20 group-hover:scale-110 group-hover:text-accent/40 transition-all duration-1000 font-light stroke-1" />
            <div className="absolute bottom-8 left-8 text-sm font-mono text-white/50 tracking-widest">
              01:32:18
            </div>
          </div>
          <div className="space-y-4 px-4">
            <div className="h-[2px] bg-white/10 overflow-hidden">
              <div className="video-progress h-full bg-accent w-0 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-full bg-white/50 blur-[4px] animate-pulse"></div>
              </div>
            </div>
            <div className="text-xs font-mono text-white/30 tracking-[0.2em] uppercase">Video Progress</div>
          </div>
        </div>

        {/* Right Side: Notes */}
        <div className="order-1 lg:order-2">
          <h2 className="text-xs font-mono text-accent mb-16 tracking-[0.2em] uppercase flex items-center gap-6">
            <span className="w-16 h-[1px] bg-accent/30"></span>
            AI Notes Generation
          </h2>
          <div className="relative overflow-hidden h-[500px] flex flex-col justify-end px-4">
            <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-b from-transparent via-background/5 to-background pointer-events-none z-20"></div>
            
            <div className="space-y-12 font-mono text-base md:text-xl relative z-10 w-full pb-8">
              <div className="ai-note flex gap-8 items-baseline">
                <span className="text-white/20 shrink-0">01 —</span>
                <span className="text-foreground font-light tracking-wide">Introduction</span>
              </div>
              <div className="ai-note flex gap-8 items-baseline">
                <span className="text-white/20 shrink-0">02 —</span>
                <span className="text-foreground font-light tracking-wide">Core Concept</span>
              </div>
              <div className="ai-note flex gap-8 items-baseline">
                <span className="text-white/20 shrink-0">03 —</span>
                <span className="text-foreground font-light tracking-wide">Important Example</span>
              </div>
              <div className="ai-note flex gap-8 items-baseline">
                <span className="text-white/20 shrink-0">04 —</span>
                <span className="text-foreground font-light tracking-wide">Key Takeaway</span>
              </div>
              <div className="ai-note flex gap-8 items-baseline">
                <span className="text-white/20 shrink-0">05 —</span>
                <span className="text-foreground font-light tracking-wide">Action Items</span>
              </div>
              
              <div className="pt-8 flex gap-6 items-center border-t border-white/5">
                <span className="w-4 h-[1px] bg-accent animate-pulse"></span>
                <span className="text-white/30 text-xs uppercase tracking-[0.2em]">Generating...</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
