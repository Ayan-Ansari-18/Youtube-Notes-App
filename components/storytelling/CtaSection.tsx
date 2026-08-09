import { Section } from "@/components/layout/Section"
import { Button } from "@/components/ui/Button"
import { ArrowRight } from "lucide-react"

export function CtaSection() {
  return (
    <Section id="about" className="py-32 md:py-64 relative overflow-hidden bg-background">
      {/* Background glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        <div className="w-[800px] h-[400px] bg-accent/20 rounded-full blur-[150px] opacity-60"></div>
      </div>
      
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <h2 className="text-5xl md:text-7xl font-bold tracking-tighter mb-8 text-foreground">
          Stop watching twice.
        </h2>
        <p className="text-xl md:text-2xl text-muted mb-12 max-w-2xl mx-auto leading-relaxed">
          Turn your next YouTube video into something you can actually remember.
        </p>
        <Button size="lg" className="h-16 px-10 text-lg rounded-xl bg-foreground text-background hover:bg-foreground/90 transition-all hover:scale-105 shadow-2xl shadow-accent/20">
          Generate My Notes
          <ArrowRight className="ml-3 h-6 w-6" />
        </Button>
      </div>
    </Section>
  )
}
