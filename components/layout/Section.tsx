import * as React from "react"
import { cn } from "@/lib/utils"

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {}

export function Section({ className, children, ...props }: SectionProps) {
  return (
    <section className={cn("w-full py-12 md:py-24 lg:py-32", className)} {...props}>
      <div className="container px-4 md:px-6 mx-auto">
        {children}
      </div>
    </section>
  )
}
