"use client"

import { Button } from "@/components/ui/Button"
import { Lock, Bookmark, FileText, Download } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export function LockedFeatureButton({ label, type }: { label: string, type: "NOTION" | "MARKDOWN" | "PDF" }) {
  const router = useRouter();

  const handleClick = () => {
    toast("Pro Feature Required", {
      description: "Upgrade to Pro to unlock " + label,
      action: {
        label: "Upgrade",
        onClick: () => router.push("/pricing"),
      },
    })
  }

  return (
    <Button 
      onClick={handleClick} 
      variant="outline" 
      className="gap-2 shrink-0 border-white/10 bg-white/5 text-muted hover:text-white hover:border-white/20 hover:bg-white/10 group transition-all relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
      {type === "NOTION" && <Bookmark className="w-4 h-4 opacity-50 group-hover:opacity-100 relative z-10" />}
      {type === "MARKDOWN" && <FileText className="w-4 h-4 opacity-50 group-hover:opacity-100 relative z-10" />}
      {type === "PDF" && <Download className="w-4 h-4 opacity-50 group-hover:opacity-100 relative z-10" />}
      <span className="relative z-10">{label}</span>
      <Lock className="w-3 h-3 ml-1 text-accent opacity-70 group-hover:opacity-100 relative z-10" />
    </Button>
  )
}
