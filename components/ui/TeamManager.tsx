"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/Button"
import { Users, Mail, Copy, Check } from "lucide-react"
import { toast } from "sonner"

export function TeamManager() {
  const [team, setTeam] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState("")
  const [inviting, setInviting] = useState(false)
  const [copiedLink, setCopiedLink] = useState<string | null>(null)

  useEffect(() => {
    fetchTeam()
  }, [])

  const fetchTeam = async () => {
    try {
      const res = await fetch("/api/team")
      const data = await res.json()
      if (res.ok) setTeam(data.team)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTeam = async () => {
    setLoading(true)
    const res = await fetch("/api/team", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: "My Team" }) })
    if (res.ok) fetchTeam()
    else { toast.error("Failed to create team"); setLoading(false) }
  }

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setInviting(true)
    try {
      const res = await fetch("/api/team/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      })
      const data = await res.json()
      if (res.ok) {
        toast.success(`Invite generated for ${email}`)
        setEmail("")
        setCopiedLink(data.inviteLink)
        fetchTeam()
      } else {
        toast.error(data.error || "Failed to invite")
      }
    } finally {
      setInviting(false)
    }
  }

  const copyToClipboard = () => {
    if (!copiedLink) return
    navigator.clipboard.writeText(copiedLink)
    toast.success("Invite link copied to clipboard")
  }

  if (loading) return <div className="animate-pulse h-32 bg-white/5 rounded-2xl mb-8"></div>

  if (!team) {
    return (
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-accent/20 rounded-xl">
            <Users className="w-6 h-6 text-accent" />
          </div>
          <div>
            <h3 className="text-xl font-bold">Team Collaboration</h3>
            <p className="text-sm text-muted">Create a team to share notes with colleagues.</p>
          </div>
        </div>
        <Button onClick={handleCreateTeam} className="bg-accent text-background hover:bg-accent/90">Create Team Workspace</Button>
      </div>
    )
  }

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
      <div className="flex items-center gap-4 mb-6">
        <div className="p-3 bg-accent/20 rounded-xl">
          <Users className="w-6 h-6 text-accent" />
        </div>
        <div>
          <h3 className="text-xl font-bold">{team.name}</h3>
          <p className="text-sm text-muted">{team.members?.length || 1} Members</p>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-sm font-semibold text-muted uppercase tracking-wider">Invite Members</h4>
        <form onSubmit={handleInvite} className="flex gap-2">
          <div className="relative flex-1">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <input 
              type="email" 
              placeholder="colleague@company.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black/50 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-accent"
              required
            />
          </div>
          <Button type="submit" disabled={inviting} className="bg-white text-black hover:bg-white/90">
            {inviting ? "Inviting..." : "Generate Invite"}
          </Button>
        </form>

        {copiedLink && (
          <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center justify-between">
            <p className="text-sm text-green-400 truncate mr-4">{copiedLink}</p>
            <Button size="sm" onClick={copyToClipboard} className="bg-green-500 hover:bg-green-600 text-white shrink-0">
              <Copy className="w-4 h-4 mr-2" /> Copy Link
            </Button>
          </div>
        )}
      </div>

      {team.invites && team.invites.length > 0 && (
        <div className="mt-6 pt-6 border-t border-white/10">
          <h4 className="text-sm font-semibold text-muted uppercase tracking-wider mb-3">Pending Invites</h4>
          <ul className="space-y-2">
            {team.invites.map((inv: any) => (
              <li key={inv.id} className="text-sm flex justify-between items-center bg-black/30 p-2 rounded-lg">
                <span>{inv.email}</span>
                <span className="text-xs text-yellow-500 bg-yellow-500/10 px-2 py-1 rounded">Pending</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
