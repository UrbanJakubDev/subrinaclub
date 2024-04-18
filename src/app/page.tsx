import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const res = await prisma.bonus.findMany();
  return res;
}


export default async function Home() {
  const user = await main();

  // Render the page with the user data
  return (
    <div>
      <h1>Users</h1>
      <pre>
        {JSON.stringify(user, null, 2)}
      </pre>
    </div>
  );
}
