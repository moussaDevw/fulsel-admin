
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    const email = 'admin@fulsel.com'
    const password = 'admin'
    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.users.upsert({
        where: { email },
        update: {},
        create: {
            email,
            name: 'Admin User',
            password: hashedPassword,
            status: 'active'
        },
    })

    console.log({ user })
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
