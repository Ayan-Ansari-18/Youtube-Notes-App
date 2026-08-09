import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {
  const result = await prisma.user.updateMany({
    data: { plan: 'ENTERPRISE' }
  })
  console.log(`Upgraded ${result.count} users to ENTERPRISE`)
}
main()
