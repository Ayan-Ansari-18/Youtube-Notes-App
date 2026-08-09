"use client"

import { Button } from "@/components/ui/Button"
import { HeadphonesIcon, Calendar } from "lucide-react"

export function AccountManagerCard() {
  return (
    <div className="bg-gradient-to-br from-accent/20 to-accent/5 border border-accent/20 rounded-2xl p-6 mb-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-accent/20 rounded-full blur-3xl -mr-16 -mt-16"></div>
      
      <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
        <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center shrink-0 border border-accent/30">
          <HeadphonesIcon className="w-8 h-8 text-accent" />
        </div>
        <div className="flex-1 text-center md:text-left">
          <h3 className="text-xl font-bold mb-1">Dedicated Account Manager</h3>
          <p className="text-sm text-muted">
            Hi, I'm Sarah! I'm here to help you get the most out of your Enterprise plan.
          </p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <Button variant="outline" className="flex-1 md:flex-none border-accent/30 hover:bg-accent/10">
            Email Me
          </Button>
          <Button className="flex-1 md:flex-none bg-accent text-background hover:bg-accent/90 gap-2">
            <Calendar className="w-4 h-4" />
            Book a Call
          </Button>
        </div>
      </div>
    </div>
  )
}
