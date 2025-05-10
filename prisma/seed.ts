import { PrismaClient, Role } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log(`Start seeding ...`);

  // 1. Create a test Organization
  const organization = await prisma.organization.create({
    data: {
      name: 'Test Organization',
    },
  });
  console.log(`Created organization: ${organization.name} (ID: ${organization.id})`);

  // 2. Create a test User
  const user = await prisma.user.create({
    data: {
      name: 'Test Owner User',
      email: 'owner@example.com',
      // Note: Real applications would handle password hashing securely.
      // For seeding, direct password storage or more complex user setup might be needed
      // depending on your auth provider. For now, we don't have a password field in User model.
      // If you add one, you can use `hashedPassword` here.
      emailVerified: new Date(), // Assume email is verified for simplicity
    },
  });
  console.log(`Created user: ${user.name} (ID: ${user.id}) - Email: ${user.email}`);

  // 3. Assign the User to the Organization with OWNER role
  const userOnOrg = await prisma.userOnOrg.create({
    data: {
      userId: user.id,
      organizationId: organization.id,
      role: Role.OWNER,
      assignedBy: user.id, // Or a system user ID, or null
    },
  });
  console.log(`Assigned user ${user.name} to organization ${organization.name} as ${userOnOrg.role}`);

  console.log(`Seeding finished.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 