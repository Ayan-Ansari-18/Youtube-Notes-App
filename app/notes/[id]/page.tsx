import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import ReactMarkdown from 'react-markdown'
import { DownloadPdfButton } from "@/components/ui/DownloadPdfButton"
import { CopyNotesButton } from "@/components/ui/CopyNotesButton"
import { ExportMarkdownButton } from "@/components/ui/ExportMarkdownButton"
import { ShareNoteButton } from "@/components/ui/ShareNoteButton"
import { CopyNotionButton } from "@/components/ui/CopyNotionButton"
import { LockedFeatureButton } from "@/components/ui/LockedFeatureButton"
import { Bookmark, Download, FileText } from "lucide-react"
import { auth } from "@/auth"

export default async function NotePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  
  const note = await prisma.note.findUnique({
    where: { id },
    include: { video: true, user: { select: { teamId: true } } }
  })

  if (!note) {
    notFound()
  }

  let userTeamId = null;
  let isPro = false;
  let isEnterprise = false;
  if (session?.user?.id) {
    const dbUser = await prisma.user.findUnique({ where: { id: session.user.id }, select: { teamId: true, plan: true } });
    userTeamId = dbUser?.teamId;
    isPro = dbUser?.plan === "PRO" || dbUser?.plan === "ENTERPRISE";
    isEnterprise = dbUser?.plan === "ENTERPRISE";
  }

  const isOwner = session?.user?.id === note.userId;
  const isTeamMember = note.isTeamShared && userTeamId && note.user?.teamId === userTeamId;

  if (!note.isPublic && !isOwner && !isTeamMember) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4 text-center">
        <h1 className="text-3xl font-bold mb-4">Private Note</h1>
        <p className="text-muted mb-8">This note is private. If you own it, please log in.</p>
        <a href="/dashboard" className="bg-accent text-background px-6 py-3 rounded-full font-medium">Go to Dashboard</a>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <main className="flex-1 container max-w-4xl mx-auto px-4 py-32 md:py-48 relative">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
            <h2 className="text-xl font-medium text-muted">Generated Notes</h2>
            <div className="flex items-center gap-2 flex-wrap">
              {isOwner && <ShareNoteButton noteId={note.id} initialIsPublic={note.isPublic} initialIsTeamShared={note.isTeamShared} isEnterprise={isEnterprise} />}
              <CopyNotesButton content={note.content} />
              
              {isPro || isOwner === false ? (
                // If it's someone else viewing a shared note, they can see buttons if the owner is pro? 
                // Let's just say if the logged in user is Pro, OR if we just want to lock it based on the logged in user's plan.
                // The prompt was "Free users ko upgrade karne ka message dikhe". So if logged in user is free, lock it.
                // But what if a free user is viewing a public note? They should still be prompted to upgrade.
                isPro ? (
                  <>
                    <CopyNotionButton content={note.content} />
                    <ExportMarkdownButton content={note.content} filename={note.video.title} />
                    <DownloadPdfButton targetId="notes-content" filename={note.video.title} />
                  </>
                ) : (
                  <>
                    <LockedFeatureButton label="Notion Export" type="NOTION" />
                    <LockedFeatureButton label="Markdown Export" type="MARKDOWN" />
                    <LockedFeatureButton label="PDF Export" type="PDF" />
                  </>
                )
              ) : (
                  <>
                    <LockedFeatureButton label="Notion Export" type="NOTION" />
                    <LockedFeatureButton label="Markdown Export" type="MARKDOWN" />
                    <LockedFeatureButton label="PDF Export" type="PDF" />
                  </>
              )}
            </div>
          </div>
        
        <article id="notes-content" className="prose prose-invert prose-lg prose-h1:editorial-heading prose-h1:mb-16 prose-a:text-accent prose-headings:tracking-tight max-w-none p-4 bg-background">
          <ReactMarkdown>{note.content}</ReactMarkdown>
        </article>
      </main>
    </div>
  )
}
