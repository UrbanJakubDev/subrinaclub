import {prisma} from "../pgDBClient";


export async function getDealers() {
   let dealers = await prisma.dealer.findMany();
   return dealers;
   }

export async function getDealerById(id: number) {
   let dealer = await prisma.dealer.findUnique({
      where: {
         id: id,
         active: true
      }
   });
   return dealer;
   }

export async function getDealersForSelect() {
   let dealers = await prisma.dealer.findMany({
      select: {
         id: true,
         fullName: true
      }
   });
   return dealers;
   }