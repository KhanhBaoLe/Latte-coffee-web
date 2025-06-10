import { PrismaClient } from '.prisma/client'
import { table } from '../app/data/id_table';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding tables...');
  
  // Xóa tất cả bàn cũ (nếu có)
  await prisma.manager_table.deleteMany({});

  // Thêm bàn mới từ data
  for (let i = 0; i < table.length; i++) {
    const tableNumber = i + 1;
    await prisma.manager_table.create({
      data: {
        id: table[i].id_table,
        tableId: tableNumber
      }
    });
    console.log(`Created table with ID: ${table[i].id_table}`);
  }

  console.log('Tables seeding finished.');
}

main()
  .catch((e) => {
    console.error('Error seeding tables:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
