import { prisma } from '../pgDBClient'

// Fetch all active bonuses
export async function fetchActiveBonusesFromDB() {
  const bonuses = await prisma.bonus.findMany({
    where: { active: true },
  });
  return bonuses.sort((a, b) => a.id - b.id);
}

// Fetch a single bonus by ID
export async function fetchBonusByIdFromDB(id: number) {
  return await prisma.bonus.findUnique({
    where: { id },
  });
}

// Create a new bonus
export async function insertBonusIntoDB(data: any) {
  return await prisma.bonus.create({
    data,
  });
}

// Update an existing bonus
export async function updateBonusInDB(id: number, data: any) {
  return await prisma.bonus.update({
    where: { id },
    data,
  });
}

// Soft delete a bonus (set active to false)
export async function softDeleteBonusInDB(id: number) {
  return await prisma.bonus.update({
    where: { id },
    data: { active: false },
  });
}

// Hard delete a bonus
export async function hardDeleteBonusInDB(id: number) {
  return await prisma.bonus.delete({
    where: { id },
  });
}

// Fetch active bonuses for options select
export async function fetchActiveBonusOptionsFromDB() {
  const bonuses = await prisma.bonus.findMany({
    where: { active: true },
    select: { id: true, name: true },
  });
  return bonuses.map(bonus => ({
    value: bonus.id,
    label: bonus.name,
  }));
}