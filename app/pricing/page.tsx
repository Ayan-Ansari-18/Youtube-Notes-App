"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Script from "next/script"
import { toast } from "sonner"

import { Section } from "@/components/layout/Section"
import { Button } from "@/components/ui/Button"
import { Check } from "lucide-react"

export default function PricingPage() {
  const [isYearly, setIsYearly] = useState(true)
  const router = useRouter()
  const [isLoading, setIsLoading] = useState<string | null>(null)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [purchasedPlan, setPurchasedPlan] = useState<string | null>(null)

  const handlePayment = async (plan: "PRO" | "ENTERPRISE") => {
    setIsLoading(plan)
    
    // --- TEMPORARY BYPASS FOR TESTING UI ---
    try {
      await fetch("/api/test-upgrade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan })
      });
      
      setTimeout(() => {
        setPurchasedPlan(plan)
        setShowSuccessModal(true)
        setIsLoading(null)
      }, 1500) // 1.5 second loading delay to look realistic
    } catch (e) {
      toast.error("Failed to mock upgrade");
      setIsLoading(null);
    }
    
    return;
    // ---------------------------------------

    try {
      const res = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan })
      })
      const data = await res.json()

      if (!res.ok) {
        toast.error(data.message || data.error || "Failed to create order. Make sure you are signed in.")
        setIsLoading(null)
        return
      }

      const options = {
        key: data.keyId || "rzp_test_YOUR_KEY_HERE",
        amount: data.amount,
        currency: data.currency,
        name: "YouTube Notes",
        description: `Upgrade to ${plan}`,
        order_id: data.orderId,
        handler: async function (response: any) {
          const verifyRes = await fetch("/api/razorpay/verify-payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            })
          })
          
          if (verifyRes.ok) {
            setPurchasedPlan(plan)
            setShowSuccessModal(true)
            setIsLoading(null)
          } else {
            toast.error("Payment verification failed")
            setIsLoading(null)
          }
        },
        prefill: {
          name: "User",
          email: "user@example.com",
        },
        theme: {
          color: "#3b82f6"
        },
        modal: {
          ondismiss: function() {
            setIsLoading(null)
          }
        }
      }

      // @ts-ignore
      const rzp = new window.Razorpay(options)
      rzp.open()
    } catch (error) {
      console.error(error)
      toast.error("Payment failed to initialize")
      setIsLoading(null)
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      <main className="flex-1 pt-32 pb-24">
        <Section className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-6">
            Simple pricing for <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-blue-500">serious creators</span>
          </h1>
          <p className="text-xl text-muted mb-12">
            Turn hours of watch time into minutes of reading. Start for free, upgrade when you need more power.
          </p>

          <div className="flex items-center justify-center gap-4 mb-16">
            <span className={`text-sm font-medium transition-colors ${!isYearly ? "text-foreground" : "text-muted"}`}>Monthly</span>
            <button 
              onClick={() => setIsYearly(!isYearly)}
              className="relative w-16 h-8 rounded-full bg-white/10 hover:bg-white/20 transition-colors p-1"
            >
              <div className={`w-6 h-6 rounded-full bg-accent transition-transform duration-300 ${isYearly ? 'translate-x-8' : 'translate-x-0'}`}></div>
            </button>
            <span className={`text-sm font-medium transition-colors flex items-center gap-2 ${isYearly ? "text-foreground" : "text-muted"}`}>
              Yearly
              <span className="text-xs bg-accent/20 text-accent px-2 py-0.5 rounded-full">Save 20%</span>
            </span>
          </div>
        </Section>

        <Section>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Free Tier */}
            <div className="p-8 rounded-3xl border border-white/10 bg-white/[0.02] flex flex-col hover:border-white/20 transition-colors">
              <h3 className="text-2xl font-bold mb-2">Free</h3>
              <p className="text-muted text-sm mb-6">Perfect for trying out the AI magic.</p>
              <div className="mb-8">
                <span className="text-5xl font-bold">₹0</span>
                <span className="text-muted">/month</span>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                {[
                  "5 AI Notes per month",
                  "Standard processing speed",
                  "Read and copy notes",
                  "Basic formatting"
                ].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm">
                    <Check className="w-5 h-5 text-accent shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button variant="outline" className="w-full">Get Started</Button>
            </div>

            {/* Pro Tier */}
            <div className="p-8 rounded-3xl border border-accent/50 bg-accent/5 flex flex-col relative transform md:-translate-y-4 shadow-2xl shadow-accent/20">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-accent text-background text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider">
                Most Popular
              </div>
              <h3 className="text-2xl font-bold mb-2">Pro</h3>
              <p className="text-muted text-sm mb-6">For students, researchers, and pros.</p>
              <div className="mb-8">
                <span className="text-5xl font-bold">{isYearly ? '₹1200' : '₹1500'}</span>
                <span className="text-muted">/month</span>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                {[
                  "Unlimited AI Notes",
                  "Lightning fast processing",
                  "Advanced semantic summaries",
                  "Export to Notion & Obsidian",
                  "Priority support"
                ].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm">
                    <Check className="w-5 h-5 text-accent shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button 
                onClick={() => handlePayment("PRO")} 
                disabled={isLoading === "PRO"}
                className="w-full bg-accent text-background hover:bg-accent/90"
              >
                {isLoading === "PRO" ? "Processing..." : "Upgrade to Pro"}
              </Button>
            </div>

            {/* Enterprise Tier */}
            <div className="p-8 rounded-3xl border border-white/10 bg-white/[0.02] flex flex-col hover:border-white/20 transition-colors">
              <h3 className="text-2xl font-bold mb-2">Enterprise</h3>
              <p className="text-muted text-sm mb-6">For teams and organizations.</p>
              <div className="mb-8">
                <span className="text-5xl font-bold">{isYearly ? '₹4900' : '₹5900'}</span>
                <span className="text-muted">/month</span>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                {[
                  "Everything in Pro",
                  "Team collaboration",
                  "Custom AI instructions",
                  "API Access",
                  "Dedicated account manager"
                ].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm">
                    <Check className="w-5 h-5 text-accent shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button 
                onClick={() => handlePayment("ENTERPRISE")} 
                disabled={isLoading === "ENTERPRISE"}
                variant="outline" 
                className="w-full"
              >
                {isLoading === "ENTERPRISE" ? "Processing..." : "Upgrade to Enterprise"}
              </Button>
            </div>
          </div>
        </Section>
      </main>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#111] border border-white/10 p-8 rounded-3xl text-center max-w-sm w-full shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-accent/20 to-transparent opacity-20"></div>
            
            <div className="relative z-10">
              <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(34,197,94,0.3)]">
                <Check className="w-10 h-10" />
              </div>
              <h2 className="text-3xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
                Congratulations !!!!
              </h2>
              <p className="text-muted text-lg mb-8">
                You are a <span className="text-accent font-bold">{purchasedPlan === "ENTERPRISE" ? "Enterprise" : "Pro"}</span> user now.
              </p>
              <Button 
                onClick={() => router.push("/dashboard")} 
                size="lg"
                className="w-full bg-accent text-background hover:bg-accent/90 text-lg rounded-xl h-14"
              >
                Go to Dashboard
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
