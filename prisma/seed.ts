import { Prisma, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const numberOfUsers = 1000;
  const numberOfLocationsPerUser = 3; // You can adjust this number if you want more or fewer locations per user

  // Create 1000 users with 3 locations each (or however many you want)
  for (let i = 0; i < numberOfUsers; i++) {
    // Create a user
    const user = await prisma.user.create({
      data: {
        email: `user${i + 1}@example.com`,
        name: `User ${i + 1}`,
      },
    });

    // Create 3 locations for each user
    for (let j = 0; j < numberOfLocationsPerUser; j++) {
      const latitude = parseFloat((Math.random() * 180 - 90).toFixed(6)); // Random latitude between -90 and 90
      const longitude = parseFloat((Math.random() * 360 - 180).toFixed(6)); // Random longitude between -180 and 180

      // Create the Point as a Well-Known Text (WKT) representation
      const point = `POINT(${longitude} ${latitude})`;

      // Insert the location using raw SQL
      await prisma.$executeRaw(Prisma.sql`
        INSERT INTO location ("userId", "latitude", "longitude", "coordinates") 
        VALUES (${user.id}, ${latitude}, ${longitude}, ST_GeomFromText(${point}, 4326));
      `);
    }

    console.log(`User ${i + 1} with locations created.`);
  }

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
