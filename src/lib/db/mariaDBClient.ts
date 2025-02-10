import { PrismaClient } from '@prisma/client';

declare const global: Global & { oldPrisma?: PrismaClient };

export let oldPrisma: PrismaClient;

if (typeof window === 'undefined') {
  if (process.env['NODE_ENV'] === 'production') {
    oldPrisma = new PrismaClient();
  } else {
    if (!global.oldPrisma) {
      global.oldPrisma = new PrismaClient();
    }
    oldPrisma = global.oldPrisma;
  }
}
