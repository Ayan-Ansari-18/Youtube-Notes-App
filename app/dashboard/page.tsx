import { auth, signOut } from "@/auth"
import { Section } from "@/components/layout/Section"
import { Button } from "@/components/ui/Button"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import Image from "next/image"
import { LogOut, FileText, Lock } from "lucide-react"
import { ApiKeyManager } from "@/components/ui/ApiKeyManager"
import { AccountManagerCard } from "@/components/ui/AccountManagerCard"

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user?.id) {
    redirect("/login")
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: session.user.id }
  })
  
  if (!dbUser) redirect("/login")

  const notes = await prisma.note.findMany({
    where: { userId: session.user.id },
    include: { video: true },
    orderBy: { createdAt: 'desc' }
  })

  const isFree = dbUser.plan === "FREE"
  const maxNotes = 5
  const usagePercentage = Math.min(100, (dbUser.noteCount / maxNotes) * 100)

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <main className="flex-1 pt-32 pb-16">
        <Section className="py-8 border-b border-white/5">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold tracking-tight">
                  Welcome back, {session.user.name?.split(' ')[0] || 'Creator'}
                </h1>
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${isFree ? 'bg-white/10 text-white' : 'bg-accent/20 text-accent border border-accent/30'}`}>
                  {dbUser.plan}
                </span>
              </div>
              <p className="text-muted">Manage your AI-generated YouTube notes.</p>
            </div>
            
            <div className="flex items-center gap-4 flex-wrap justify-end">
              {isFree && (
                 <div className="flex items-center gap-4 bg-white/5 px-4 py-2 rounded-xl border border-white/10">
                   <div className="flex flex-col gap-1 w-24 md:w-32">
                     <div className="flex justify-between text-xs text-muted">
                        <span>Usage</span>
                        <span>{dbUser.noteCount} / {maxNotes}</span>
                     </div>
                     <div className="h-1.5 bg-black rounded-full overflow-hidden">
                       <div className="h-full bg-accent transition-all" style={{ width: `${usagePercentage}%` }}></div>
                     </div>
                   </div>
                   <Link href="/pricing">
                     <button className="bg-accent text-background hover:bg-accent/90 px-3 py-1 rounded-md text-xs font-semibold">
                       Upgrade
                     </button>
                   </Link>
                 </div>
              )}
              
              <form action={async () => {
                "use server"
                await signOut()
              }}>
                <Button type="submit" variant="outline" className="gap-2">
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </Button>
              </form>
            </div>
          </div>

          {dbUser.plan === "ENTERPRISE" && (
            <ApiKeyManager initialKey={dbUser.apiKey} />
          )}

          {dbUser.plan === "ENTERPRISE" && (
            <div className="mt-8">
              <AccountManagerCard />
            </div>
          )}
          {(dbUser.plan === "PRO" || dbUser.plan === "FREE") && (
            <div className="mt-8 w-full relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.03] to-transparent" style={{minHeight: '280px'}}>
              {/* Glow background */}
              <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-blue-500/5 pointer-events-none" />
              
              <div className="relative z-10 flex flex-col items-center justify-center text-center p-12 h-full" style={{minHeight: '280px'}}>
                <div className="w-16 h-16 bg-accent/15 border border-accent/30 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-accent/10">
                  <Lock className="w-7 h-7 text-accent" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-white">Enterprise Features</h3>
                <p className="text-muted mb-8 max-w-md mx-auto text-sm leading-relaxed">
                  Upgrade to Enterprise to unlock Custom AI Instructions, API Access, and a Dedicated Account Manager.
                </p>
                <Link href="/pricing">
                  <Button className="bg-accent text-background hover:bg-accent/90 shadow-lg shadow-accent/20 px-8 py-2 rounded-xl font-semibold">
                    Upgrade to Unlock →
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </Section>

        <Section className="py-12">
          {notes.length === 0 ? (
            <div className="text-center py-24 border border-dashed border-white/10 rounded-3xl bg-white/[0.02]">
              <div className="w-16 h-16 bg-accent/20 text-accent rounded-full flex items-center justify-center mx-auto mb-6">
                <FileText className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-medium mb-2">No notes yet</h3>
              <p className="text-muted mb-8 max-w-sm mx-auto">
                You haven't generated any notes yet. Paste a YouTube link on the homepage to get started.
              </p>
              <Link href="/">
                <Button>Generate Note</Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {notes.map((note) => (
                <Link key={note.id} href={`/notes/${note.id}`} className="group relative">
                  <div className="absolute -inset-0.5 bg-gradient-to-br from-accent to-blue-600 rounded-3xl blur opacity-0 group-hover:opacity-30 transition duration-500"></div>
                  <div className="relative h-full bg-[#0a0a0a] border border-white/10 rounded-3xl p-6 flex flex-col gap-4 hover:border-white/20 transition-colors">
                    <div className="flex items-center gap-3 text-accent mb-2">
                      <div className="relative w-5 h-5 shrink-0">
                        <Image src="/logo.png" alt="Video Logo" fill className="object-contain" />
                      </div>
                      <span className="text-xs font-mono uppercase tracking-wider">YouTube Video</span>
                    </div>
                    <h3 className="text-xl font-semibold line-clamp-2">{note.video.title}</h3>
                    <p className="text-muted line-clamp-3 flex-1 text-sm mt-2">
                      {note.content.substring(0, 120)}...
                    </p>
                    <div className="pt-4 mt-4 border-t border-white/5 text-xs text-muted/50 flex justify-between items-center">
                      <span>{new Date(note.createdAt).toLocaleDateString()}</span>
                      <span className="group-hover:text-accent transition-colors">View Notes &rarr;</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </Section>
      </main>
    </div>
  )
}
