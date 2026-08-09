import { auth } from "@/auth"
import { Navigation } from "./Navigation"

export async function NavWrapper() {
  const session = await auth()
  return <Navigation session={session} />
}
