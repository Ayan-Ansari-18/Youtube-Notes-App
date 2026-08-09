import { ArrowRight } from "lucide-react"
import Link from "next/link"

export function FinalCTASection() {
  return (
    <section className="py-64 relative overflow-hidden bg-foreground text-background">
      <div className="container mx-auto px-4 text-center relative z-10">
        <h2 className="editorial-heading mb-12 max-w-4xl mx-auto tracking-tighter">
          Ready to turn videos into knowledge?
        </h2>
        <p className="text-xl md:text-2xl mb-16 text-background/80 max-w-2xl mx-auto font-light">
          Join thousands of learners saving hours every week with AI-powered notes.
        </p>
        <Link href="/login" className="inline-flex items-center gap-4 bg-background text-foreground px-12 py-6 text-lg font-medium hover:opacity-80 transition-opacity duration-300">
          Get Started For Free
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </section>
  )
}
