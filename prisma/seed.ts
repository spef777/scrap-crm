import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Create default admin user
  const hashedPassword = await bcrypt.hash('admin123', 12)
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@scrapcrm.com' },
    update: {},
    create: {
      email: 'admin@scrapcrm.com',
      name: 'Admin User',
      password: hashedPassword,
      role: 'admin',
    },
  })

  console.log('✅ Seed complete. Admin:', admin.email)
  console.log('   Password: admin123')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
