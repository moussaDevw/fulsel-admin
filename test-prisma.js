const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  try {
    const residence = await prisma.residences.create({
      data: {
        title: "Test Residence",
        slug: "test-residence-" + Date.now(),
        image_cover: "https://example.com/cover.jpg",
        image_banner: "https://example.com/banner.jpg",
        status: "en_cours",
        startDate: new Date(),
        endDate: new Date(),
        residence_descriptions: {
          create: [{ paragraph: "Test paragraph", position: 0 }]
        }
      }
    })
    console.log("Success:", residence.id.toString())
  } catch (err) {
    console.error("Error details:", err)
  } finally {
    await prisma.$disconnect()
  }
}

main()
