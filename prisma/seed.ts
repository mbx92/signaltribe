import { createHash } from "node:crypto";
import { PrismaClient } from "@prisma/client";
import { getDefaultLandingPageBlocks } from "../server/utils/cms";

const prisma = new PrismaClient();

const roleSeeds = [
  {
    name: "admin",
    description: "Full access to manage users, roles, and system settings.",
  },
  {
    name: "analyst",
    description: "Provide trading signals, manage premium subscriptions, and view analysis.",
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
    avatar: "https://i.pravatar.cc/150?u=admin_st1",
  },
  {
    email: "trader@saastrader.local",
    name: "Active Trader",
    password: "trader123",
    role: "trader",
    avatar: "https://i.pravatar.cc/150?u=user1",
  },
  {
    email: "alex@saastrader.local",
    name: "Alex Crypto",
    password: "analyst123",
    role: "analyst",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
    analystProfile: {
      specialty: "Crypto / DeFi",
      experience: 5,
      monthlyPrice: 49,
      status: "APPROVED" as const,
    },
  },
  {
    email: "sarah@saastrader.local",
    name: "Sarah FX",
    password: "analyst123",
    role: "analyst",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
    analystProfile: {
      specialty: "Forex / Commodities",
      experience: 10,
      monthlyPrice: 35,
      status: "APPROVED" as const,
    },
  },
  {
    email: "marcus@saastrader.local",
    name: "Marcus Macro",
    password: "analyst123",
    role: "analyst",
    avatar: "https://i.pravatar.cc/150?u=a04258a2462d826712d",
    analystProfile: {
      specialty: "Macro / Indices",
      experience: 8,
      monthlyPrice: 79,
      status: "APPROVED" as const,
    },
  },
];

const signalSeeds = [
  {
    analystEmail: "alex@saastrader.local",
    pair: "BTC/USDT",
    direction: "LONG" as const,
    entry: 64200,
    tp: 66500,
    sl: 63000,
    current: 65100,
    status: "ACTIVE" as const,
    timeframe: "H4" as const,
    risk: "MEDIUM" as const,
    notes: "Strong support at 64K. Expecting breakout above 65K resistance.",
  },
  {
    analystEmail: "alex@saastrader.local",
    pair: "ETH/USDT",
    direction: "SHORT" as const,
    entry: 3450,
    tp: 3300,
    sl: 3520,
    current: 3510,
    status: "ACTIVE" as const,
    timeframe: "H4" as const,
    risk: "HIGH" as const,
    notes: "Bearish divergence on RSI. Key resistance at 3500.",
  },
  {
    analystEmail: "alex@saastrader.local",
    pair: "SOL/USDT",
    direction: "LONG" as const,
    entry: 155,
    tp: 168,
    sl: 149,
    current: 159.2,
    status: "ACTIVE" as const,
    timeframe: "D1" as const,
    risk: "MEDIUM" as const,
    notes: "Bullish flag pattern forming. Volume increasing.",
  },
  {
    analystEmail: "sarah@saastrader.local",
    pair: "EUR/USD",
    direction: "LONG" as const,
    entry: 1.0850,
    tp: 1.0920,
    sl: 1.0800,
    current: 1.0880,
    status: "ACTIVE" as const,
    timeframe: "H4" as const,
    risk: "LOW" as const,
    notes: "ECB dovish tone. Support at 1.0850.",
  },
  {
    analystEmail: "marcus@saastrader.local",
    pair: "SPX500",
    direction: "SHORT" as const,
    entry: 5420,
    tp: 5350,
    sl: 5460,
    status: "ACTIVE" as const,
    timeframe: "D1" as const,
    risk: "MEDIUM" as const,
    notes: "Overbought conditions on weekly RSI. Fed uncertainty.",
  },
  {
    analystEmail: "alex@saastrader.local",
    pair: "BTC/USDT",
    direction: "LONG" as const,
    entry: 60000,
    tp: 63000,
    sl: 58500,
    current: 63200,
    status: "TP_HIT" as const,
    timeframe: "D1" as const,
    risk: "MEDIUM" as const,
    notes: "Halving rally play.",
  },
  {
    analystEmail: "alex@saastrader.local",
    pair: "DOGE/USDT",
    direction: "LONG" as const,
    entry: 0.15,
    tp: 0.18,
    sl: 0.13,
    current: 0.125,
    status: "SL_HIT" as const,
    timeframe: "H1" as const,
    risk: "HIGH" as const,
    notes: "Meme coin momentum play.",
  },
];

const journalSeeds = [
  {
    analystEmail: "alex@saastrader.local",
    title: "Macro Review: FOMC Impact on Crypto Markets",
    content: "The Federal Reserve's latest FOMC meeting has significant implications for crypto markets. Key takeaways: 1) Rate cuts expected in Q3, bullish for risk assets. 2) Dollar weakness supports BTC narrative. 3) Institutional inflows continue via ETF approvals. Strategy: Maintain long bias on BTC and ETH with tight stops.",
    status: "PUBLISHED" as const,
    views: 840,
  },
  {
    analystEmail: "alex@saastrader.local",
    title: "Trade Breakdown: AAPL Earnings Setup Thesis",
    content: "Apple's earnings season is approaching and the chart shows an interesting setup. The stock has been consolidating near support at $180 with decreasing volume - a classic accumulation pattern. My thesis: Long entry at $182 with TP at $195 and SL at $175. Risk-reward of 2.6:1.",
    status: "PUBLISHED" as const,
    views: 1240,
  },
  {
    analystEmail: "alex@saastrader.local",
    title: "Weekly Outlook: Key Levels to Watch — BTC, ETH, SOL",
    content: "This week's key levels: BTC support at 63K, resistance at 67K. ETH watching 3400 support. SOL breakout above 160 could target 175. Overall market sentiment: cautiously bullish. Key risk: CPI data Wednesday.",
    status: "PUBLISHED" as const,
    views: 2100,
  },
  {
    analystEmail: "sarah@saastrader.local",
    title: "EUR/USD Analysis: ECB Rate Decision Preview",
    content: "The ECB rate decision this week is pivotal for EUR/USD. Markets are pricing a 25bp cut. If the ECB signals more cuts ahead, expect EUR weakness. However, if they maintain a data-dependent stance, EUR could rally. Key level: 1.0850 support.",
    status: "PUBLISHED" as const,
    views: 620,
  },
];

const settingSeeds = [
  { key: "appName", value: "SignalTribe" },
  { key: "timezone", value: "Asia/Jakarta" },
  { key: "paymentGateway", value: "midtrans" },
  { key: "platformFeePercent", value: "20" },
  { key: "cmsBlocks", value: JSON.stringify(getDefaultLandingPageBlocks()) },
];

const hashPassword = (raw: string): string =>
  createHash("sha256").update(raw).digest("hex");

async function main() {
  console.log("Seeding roles...");
  const roles: Record<string, { id: string }> = {};

  for (const role of roleSeeds) {
    const record = await prisma.role.upsert({
      where: { name: role.name },
      update: { description: role.description },
      create: role,
    });
    roles[role.name] = record;
  }

  console.log("Seeding users & analyst profiles...");
  const users: Record<string, { id: string }> = {};

  for (const user of userSeeds) {
    const roleId = roles[user.role]?.id;
    if (!roleId) {
      console.warn(`Role ${user.role} not found for user ${user.email}`);
      continue;
    }

    const record = await prisma.user.upsert({
      where: { email: user.email },
      update: {
        name: user.name,
        password: hashPassword(user.password),
        avatar: user.avatar || null,
        roleId,
      },
      create: {
        email: user.email,
        name: user.name,
        password: hashPassword(user.password),
        avatar: user.avatar || null,
        roleId,
      },
    });
    users[user.email] = record;

    // Create analyst profile if applicable
    if ((user as any).analystProfile) {
      const profile = (user as any).analystProfile;
      await prisma.analystProfile.upsert({
        where: { userId: record.id },
        update: {
          specialty: profile.specialty,
          experience: profile.experience,
          monthlyPrice: profile.monthlyPrice,
          status: profile.status,
        },
        create: {
          userId: record.id,
          specialty: profile.specialty,
          experience: profile.experience,
          monthlyPrice: profile.monthlyPrice,
          status: profile.status,
        },
      });
    }
  }

  console.log("Seeding signals...");
  for (const signal of signalSeeds) {
    const userId = users[signal.analystEmail]?.id;
    if (!userId) continue;

    await prisma.signal.create({
      data: {
        userId,
        pair: signal.pair,
        direction: signal.direction,
        entry: signal.entry,
        tp: signal.tp,
        sl: signal.sl,
        current: signal.current ?? null,
        status: signal.status,
        timeframe: signal.timeframe,
        risk: signal.risk,
        notes: signal.notes,
        closedAt: signal.status !== "ACTIVE" ? new Date() : null,
      },
    });
  }

  console.log("Seeding journal entries...");
  for (const journal of journalSeeds) {
    const userId = users[journal.analystEmail]?.id;
    if (!userId) continue;

    await prisma.journalEntry.create({
      data: {
        userId,
        title: journal.title,
        content: journal.content,
        status: journal.status,
        views: journal.views,
      },
    });
  }

  console.log("Seeding subscriptions...");
  // trader subscribes to all 3 analysts
  const traderId = users["trader@saastrader.local"]?.id;
  if (traderId) {
    for (const analystEmail of ["alex@saastrader.local", "sarah@saastrader.local", "marcus@saastrader.local"]) {
      const analystUserId = users[analystEmail]?.id;
      if (!analystUserId) continue;

      const profile = await prisma.analystProfile.findUnique({ where: { userId: analystUserId } });
      if (!profile) continue;

      const endDate = new Date();
      endDate.setDate(endDate.getDate() + 30);

      const sub = await prisma.subscription.upsert({
        where: { userId_analystId: { userId: traderId, analystId: profile.id } },
        update: { status: "ACTIVE", priceAtPurchase: profile.monthlyPrice },
        create: {
          userId: traderId,
          analystId: profile.id,
          status: "ACTIVE",
          priceAtPurchase: profile.monthlyPrice,
          endDate,
        },
      });

      await prisma.payment.create({
        data: {
          userId: traderId,
          subscriptionId: sub.id,
          amount: profile.monthlyPrice,
          status: "PAID",
        },
      });
    }
  }

  console.log("Seeding settings...");
  for (const setting of settingSeeds) {
    await prisma.setting.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: setting,
    });
  }

  console.log("Seed complete!");
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
