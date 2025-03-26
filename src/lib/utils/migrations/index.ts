
import { oldPrisma } from '@/lib/db/mariaDBClient';
import { prisma } from '@/lib/db/pgDBClient';

export async function migrateDealers() {
  try {
    // Get all dealers from old MariaDB
    const oldDealers = await oldPrisma.$queryRaw`
      SELECT 
        id,
        active,
        created as createdAt,
        updated as updatedAt,
        fullname as fullName,
        reg_number as registrationNumber,
        ico,
        phone,
        email,
        reg_since as registratedSince,
        address,
        town,
        psc,
        note
      FROM dealers
    `;


    // Migrate each dealer to new PostgreSQL DB
    for (const dealer of oldDealers) {
      await prisma.dealer.create({
        data: {
          active: dealer.active === 1,
          createdAt: dealer.createdAt,
          updatedAt: dealer.updatedAt,
          fullName: dealer.fullName,
          registrationNumber: dealer.registrationNumber,
          ico: dealer.ico,
          phone: dealer.phone,
          email: dealer.email,
          registratedSince: dealer.registratedSince,
          address: dealer.address,
          town: dealer.town,
          psc: dealer.psc,
          note: dealer.note
        }
      });
    }

  } catch (error) {
    console.error('Error migrating dealers:', error);
    throw error;
  }
}
