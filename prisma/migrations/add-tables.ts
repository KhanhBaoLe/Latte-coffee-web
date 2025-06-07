import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Tạo 10 bàn với ID từ table1 đến table10
  for (let i = 1; i <= 10; i++) {
    await prisma.managerTable.create({
      data: {
        id: `table${i}`,
        tableId: i,
      },
    });
  }

  console.log('Tables have been created successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
