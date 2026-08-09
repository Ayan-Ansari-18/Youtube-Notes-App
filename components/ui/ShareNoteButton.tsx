"use client"

import { useState } from "react"
import { Button } from "@/components/ui/Button"
import { Share2, Lock, Globe, Check, Users } from "lucide-react"
import { toast } from "sonner"

export function ShareNoteButton({ noteId, initialIsPublic, initialIsTeamShared = false, isEnterprise = false }: { noteId: string, initialIsPublic: boolean, initialIsTeamShared?: boolean, isEnterprise?: boolean }) {
  const [isPublic, setIsPublic] = useState(initialIsPublic)
  const [isTeamShared, setIsTeamShared] = useState(initialIsTeamShared)
  const [isLoading, setIsLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const toggleShare = async (type: "PUBLIC" | "TEAM") => {
    setIsLoading(true)
    const payload = type === "PUBLIC" ? { isPublic: !isPublic } : { isTeamShared: !isTeamShared }
    
    try {
      const res = await fetch(`/api/notes/${noteId}/share`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })
      
      const data = await res.json()
      if (res.ok) {
        if (type === "PUBLIC") {
          setIsPublic(data.isPublic)
          if (data.isPublic) {
            toast.success("Note is now public!")
            copyLink()
          } else {
            toast.success("Note is now private.")
          }
        } else {
          setIsTeamShared(data.isTeamShared)
          toast.success(data.isTeamShared ? "Shared with Team!" : "Removed from Team.")
        }
      } else {
        toast.error(data.error || "Failed to update share settings")
      }
    } catch (err) {
      toast.error("An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const copyLink = () => {
    const url = `${window.location.origin}/notes/${noteId}`
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    toast.success("Public link copied to clipboard")
  }

  return (
    <div className="flex items-center gap-2">
      {isEnterprise && (
        <Button 
          onClick={() => toggleShare("TEAM")} 
          disabled={isLoading}
          variant={isTeamShared ? "default" : "outline"}
          className={`gap-2 shrink-0 border-white/20 hover:bg-white/10 ${isTeamShared ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/50 hover:bg-indigo-500/30' : ''}`}
        >
          <Users className="w-4 h-4" />
          {isTeamShared ? "Team Access" : "Share to Team"}
        </Button>
      )}

      <Button 
        onClick={() => toggleShare("PUBLIC")} 
        disabled={isLoading}
        variant={isPublic ? "default" : "outline"}
        className={`gap-2 shrink-0 border-white/20 hover:bg-white/10 ${isPublic ? 'bg-accent/20 text-accent border-accent/50 hover:bg-accent/30' : ''}`}
      >
        {isPublic ? <Globe className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
        {isPublic ? "Public" : "Private"}
      </Button>
      
      {isPublic && (
        <Button 
          onClick={copyLink} 
          variant="outline" 
          className="gap-2 shrink-0 border-white/20 hover:bg-white/10"
        >
          {copied ? <Check className="w-4 h-4 text-green-500" /> : <Share2 className="w-4 h-4" />}
          {copied ? "Copied Link" : "Copy Link"}
        </Button>
      )}
    </div>
  )
}
