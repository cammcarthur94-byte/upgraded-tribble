import { PrismaClient } from "@prisma/client";
import { MOCK_USER, MOCK_BRANDS } from "../src/lib/mock-data";

const prisma = new PrismaClient({
  log: ["info", "warn", "error"],
});

async function main() {
  console.log("=== Testing Neon Postgres Connection ===");
  
  // 1. Raw query to verify server version and database name
  const result = await prisma.$queryRaw<Array<{ now: Date; version: string; current_database: string }>>`
    SELECT NOW() as now, version() as version, current_database() as current_database;
  `;
  console.log("Connected successfully to Neon Postgres!");
  console.log("Database:", result[0].current_database);
  console.log("Timestamp:", result[0].now);
  console.log("Postgres Version:", result[0].version.split(" ")[0], result[0].version.split(" ")[1]);

  // 2. Upsert user
  const user = await prisma.user.upsert({
    where: { id: MOCK_USER.id },
    update: {
      email: MOCK_USER.email,
      fullName: MOCK_USER.fullName,
      role: MOCK_USER.role,
    },
    create: {
      id: MOCK_USER.id,
      email: MOCK_USER.email,
      fullName: MOCK_USER.fullName,
      role: MOCK_USER.role,
    },
  });
  console.log("Verified User in Neon:", user.email);

  // 3. Upsert mock brands
  for (const b of MOCK_BRANDS) {
    const brand = await prisma.brand.upsert({
      where: { id: b.id },
      update: {
        brandName: b.brandName,
        domain: b.domain,
        aliases: b.aliases,
        exactUrls: b.exactUrls,
      },
      create: {
        id: b.id,
        userId: user.id,
        brandName: b.brandName,
        domain: b.domain,
        aliases: b.aliases,
        exactUrls: b.exactUrls,
      },
    });

    // Competitors
    for (const c of b.competitorRecords || []) {
      await prisma.competitor.upsert({
        where: { id: c.id },
        update: {
          competitorName: c.competitorName,
          domain: c.domain,
        },
        create: {
          id: c.id,
          brandId: brand.id,
          competitorName: c.competitorName,
          domain: c.domain,
        },
      });
    }
  }

  const brandCount = await prisma.brand.count();
  const compCount = await prisma.competitor.count();
  console.log(`Neon Database Seeded: ${brandCount} brands, ${compCount} competitor records active.`);

  console.log("=== End-to-End Test PASSED ===");
}

main()
  .catch((e) => {
    console.error("Neon test error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
