import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Starting default password assignment for users...');
  
  const defaultPassword = process.env.DEFAULT_USER_PASSWORD || 'Kowtha@123';
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(defaultPassword, salt);

  const users = await prisma.user.findMany({
    where: {
      password: null,
    },
    select: {
      id: true,
      name: true,
      mobile: true,
      email: true,
    },
  });

  console.log(`Found ${users.length} users with null passwords.`);

  let updatedCount = 0;
  for (const user of users) {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        isPasswordChanged: false,
      },
    });
    console.log(`✅ Set default password for user: ${user.name} (${user.mobile})`);
    updatedCount++;
  }

  console.log(`🎉 Finished! Successfully assigned default password "${defaultPassword}" to ${updatedCount} users.`);
}

main()
  .catch((e) => {
    console.error('❌ Error setting default passwords:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
