import { Section } from "@/components/layout/Section"
import { Button } from "@/components/ui/Button"
import { signIn } from "@/auth"
import { PlaySquare } from "lucide-react"
import Link from "next/link"

export default function LoginPage() {
  return (
    <Section className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md mx-auto w-full p-8 border border-border/50 bg-card/30 rounded-3xl backdrop-blur-sm text-center">
        <div className="flex justify-center mb-8">
          <PlaySquare className="h-12 w-12 text-accent" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Welcome back</h1>
        <p className="text-muted mb-8">Sign in to your account to continue.</p>
        
        <form
          action={async () => {
            "use server"
            await signIn("google", { redirectTo: "/dashboard" })
          }}
        >
          <Button type="submit" size="lg" className="w-full h-12 rounded-xl text-base bg-foreground text-background hover:bg-foreground/90">
            Continue with Google
          </Button>
        </form>
        
        <p className="mt-6 text-sm text-muted">
          Don't have an account? <Link href="/signup" className="text-accent hover:underline">Sign up</Link>
        </p>
        
        <p className="mt-8 text-xs text-muted">
          By clicking continue, you agree to our <Link href="/terms" className="hover:text-accent transition-colors">Terms of Service</Link> and <Link href="/privacy" className="hover:text-accent transition-colors">Privacy Policy</Link>.
        </p>
      </div>
    </Section>
  )
}
