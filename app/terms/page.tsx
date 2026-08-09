import { Section } from "@/components/layout/Section"
import { Scale } from "lucide-react"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <main className="flex-1 pt-32 pb-24">
        <Section className="max-w-4xl mx-auto">
          <div className="flex flex-col items-center text-center mb-16">
            <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mb-6 border border-accent/20 shadow-[0_0_30px_rgba(59,130,246,0.15)]">
              <Scale className="w-10 h-10 text-accent" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70">
              Terms of Service
            </h1>
            <p className="text-muted text-lg">Last updated: August 10, 2026</p>
          </div>
          
          <div className="prose prose-invert prose-lg max-w-none prose-headings:tracking-tight prose-headings:text-white prose-h2:mt-12 prose-h2:mb-6 prose-a:text-accent prose-a:no-underline hover:prose-a:underline bg-white/[0.02] p-8 md:p-12 rounded-3xl border border-white/5 shadow-2xl">
            <p className="lead text-xl text-white/80">
              Please read these Terms of Service carefully before using our platform. By accessing or using YouTube Notes, you agree to be bound by these terms.
            </p>

            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing and using our services, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by these terms, please do not use our service.
            </p>

            <h2>2. Description of Service</h2>
            <p>
              YouTube Notes provides an AI-powered platform to convert YouTube video transcripts into structured, readable notes. We offer Free, Pro, and Enterprise tiers with varying levels of features, limits, and processing speeds.
            </p>

            <h2>3. Subscriptions and Payments</h2>
            <ul>
              <li><strong>Billing:</strong> Premium features require a paid subscription. Payments are processed securely via our payment partners.</li>
              <li><strong>Refunds:</strong> We offer a 7-day money-back guarantee for initial purchases. Renewals are non-refundable unless required by law.</li>
              <li><strong>Fair Use:</strong> While our Pro plan offers "Unlimited AI Notes", it is subject to a fair use policy to prevent automated bot abuse or API scraping.</li>
            </ul>

            <h2>4. User Content and Conduct</h2>
            <p>
              You retain all rights to the notes you generate. However, you agree not to use our service to generate or share content that is illegal, abusive, harassing, or violates the intellectual property rights of others (including bypassing YouTube's core terms regarding copyright).
            </p>

            <h2>5. Intellectual Property</h2>
            <p>
              The platform, its original content, features, and functionality are owned by YouTube Notes and are protected by international copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws.
            </p>

            <h2>6. Limitation of Liability</h2>
            <p>
              In no event shall YouTube Notes, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.
            </p>

            <h2>7. Contact Information</h2>
            <p>
              If you have any questions about these Terms, please contact us at <a href="mailto:legal@youtubenotes.com">legal@youtubenotes.com</a>.
            </p>
          </div>
        </Section>
      </main>
    </div>
  )
}
