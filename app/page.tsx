import { Footer } from "@/components/layout/Footer"
import { HeroSection } from "@/components/hero/HeroSection"
import { ProblemSection } from "@/components/storytelling/ProblemSection"
import { HowItWorksSection } from "@/components/storytelling/HowItWorksSection"
import { TransformationSection } from "@/components/storytelling/TransformationSection"
import { FeaturesSection } from "@/components/storytelling/FeaturesSection"
import { UseCasesSection } from "@/components/storytelling/UseCasesSection"
import { CtaSection } from "@/components/storytelling/CtaSection"
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-background text-foreground selection:bg-accent/30 selection:text-foreground relative">
      
      {/* Scroll Storytelling Narrative */}
      <HeroSection />
      <ProblemSection />
      <HowItWorksSection />
      <TransformationSection />
      <FeaturesSection />
      <UseCasesSection />
      <CtaSection />

      <Footer />
    </main>
  );
}
