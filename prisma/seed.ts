import { createHash } from "node:crypto";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const roleSeeds = [
  {
    name: "admin",
    description: "Full access to manage users, roles, and system settings.",
  },
  {
    name: "trader",
    description: "Create strategies, manage portfolios, and execute trades.",
  },
  {
    name: "viewer",
    description: "Read-only visibility into dashboards and reports.",
  },
];

const userSeeds = [
  {
    email: "admin@saastrader.local",
    name: "SaaS Trader Admin",
    password: "admin123",
    role: "admin",
  },
  {
    email: "analyst@saastrader.local",
    name: "Strategy Analyst",
    password: "analyst123",
    role: "trader",
  },
];

const hashPassword = (raw: string): string =>
  createHash("sha256").update(raw).digest("hex");

async function main() {
  const roles: Record<string, { id: string }> = {};

  for (const role of roleSeeds) {
    const record = await prisma.role.upsert({
      where: { name: role.name },
      update: {
        description: role.description,
      },
      create: role,
    });

    roles[role.name] = record;
  }

  for (const user of userSeeds) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {
        name: user.name,
        password: hashPassword(user.password),
        roleId: roles[user.role].id,
      },
      create: {
        email: user.email,
        name: user.name,
        password: hashPassword(user.password),
        roleId: roles[user.role].id,
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log("Seed data applied successfully.");
  })
  .catch(async (error) => {
    console.error("Seeding failed", error);
    await prisma.$disconnect();
    process.exit(1);
  });
