import { Section } from "@/components/layout/Section"
import { Shield } from "lucide-react"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <main className="flex-1 pt-32 pb-24">
        <Section className="max-w-4xl mx-auto">
          <div className="flex flex-col items-center text-center mb-16">
            <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mb-6 border border-accent/20 shadow-[0_0_30px_rgba(59,130,246,0.15)]">
              <Shield className="w-10 h-10 text-accent" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70">
              Privacy Policy
            </h1>
            <p className="text-muted text-lg">Last updated: August 10, 2026</p>
          </div>
          
          <div className="prose prose-invert prose-lg max-w-none prose-headings:tracking-tight prose-headings:text-white prose-h2:mt-12 prose-h2:mb-6 prose-a:text-accent prose-a:no-underline hover:prose-a:underline bg-white/[0.02] p-8 md:p-12 rounded-3xl border border-white/5 shadow-2xl">
            <p className="lead text-xl text-white/80">
              At YouTube Notes, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our service.
            </p>

            <h2>1. Information We Collect</h2>
            <p>
              We collect information that you provide directly to us when you register for an account, subscribe to our premium plans (Pro or Enterprise), or communicate with us. This includes:
            </p>
            <ul>
              <li><strong>Personal Data:</strong> Email address, name, and profile picture (via Google OAuth).</li>
              <li><strong>Usage Data:</strong> YouTube video URLs you process, notes generated, and interaction with our platform.</li>
              <li><strong>Payment Information:</strong> Processed securely by Razorpay. We do not store your full credit card details.</li>
            </ul>

            <h2>2. How We Use Your Information</h2>
            <p>
              We use the information we collect primarily to provide, maintain, and improve our AI note-generation services. Specifically, we use it to:
            </p>
            <ul>
              <li>Generate accurate summaries from your requested YouTube videos.</li>
              <li>Process your transactions and manage your subscription tier.</li>
              <li>Send you technical notices, updates, and support messages.</li>
              <li>Understand and analyze how you use our platform to build better features.</li>
            </ul>

            <h2>3. AI Processing & Data Privacy</h2>
            <p>
              Your trust is our priority. When you submit a YouTube video URL, we process the video's transcript using advanced AI models. <strong>We do not use your generated notes to train public AI models.</strong> Your private notes remain completely accessible only to you, unless you explicitly choose to share them publicly or with your Team.
            </p>

            <h2>4. Data Security</h2>
            <p>
              We have implemented appropriate technical and organizational security measures designed to protect the security of any personal information we process. However, please also remember that we cannot guarantee that the internet itself is 100% secure.
            </p>

            <h2>5. Contact Us</h2>
            <p>
              If you have questions or comments about this Privacy Policy, please contact us at: <a href="mailto:privacy@youtubenotes.com">privacy@youtubenotes.com</a>.
            </p>
          </div>
        </Section>
      </main>
    </div>
  )
}
