import { PrismaClient, Role, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

const YOUR_USER_ID = "cmagmhuft00005ky1zryulmyo";
const ORGANIZATION_NAME = "hipaaforms";
const USER_ROLE_IN_ORG = Role.OWNER;

async function main() {
  console.log(`Starting script to assign user ${YOUR_USER_ID} to organization "${ORGANIZATION_NAME}"...`);

  // 1. Find or Create the Organization
  // First, ensure your Organization model has a unique constraint on the 'name' field for this to work reliably,
  // or adjust to findFirst and then create if not found.
  let organization = await prisma.organization.findFirst({
    where: { name: ORGANIZATION_NAME }, 
  });

  if (!organization) {
    console.log(`Organization "${ORGANIZATION_NAME}" not found. Creating it...`);
    try {
      organization = await prisma.organization.create({
        data: {
          name: ORGANIZATION_NAME,
        },
      });
      console.log(`Created organization: ${organization.name} (ID: ${organization.id})`);
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
        // Check if meta and target exist and target includes 'name'
        const target = (e.meta?.target as string[] | undefined);
        if (target?.includes('name')) {
          console.warn(`Organization "${ORGANIZATION_NAME}" was likely created by a concurrent process or already exists. Fetching it again.`);
          organization = await prisma.organization.findFirst({
            where: { name: ORGANIZATION_NAME },
          });
          if (!organization) {
            console.error(`Failed to find organization "${ORGANIZATION_NAME}" after P2002 error.`);
            throw e; 
          }
          console.log(`Found organization after P2002: ${organization.name} (ID: ${organization.id})`);
        } else {
          console.error(`Error creating organization (P2002 on different field or meta is undefined):`, e);
          throw e; 
        }
      } else {
        console.error(`Error creating organization:`, e);
        throw e; 
      }
    }
  } else {
    console.log(`Found existing organization: ${organization.name} (ID: ${organization.id})`);
  }

  // 2. Check if user exists
  const user = await prisma.user.findUnique({
    where: { id: YOUR_USER_ID },
  });

  if (!user) {
    console.error(`User with ID ${YOUR_USER_ID} not found. Please ensure this user exists.`);
    return; // Exit if user not found
  }
  console.log(`Found user: ${user.name || user.email || user.id} (ID: ${user.id})`);

  // 3. Assign the User to the Organization with the specified role
  try {
    const userOnOrg = await prisma.userOnOrg.upsert({
      where: {
        userId_organizationId: {
          userId: user.id,
          organizationId: organization.id,
        }
      },
      update: {
        role: USER_ROLE_IN_ORG, // Update role if user already in org
      },
      create: {
        userId: user.id,
        organizationId: organization.id,
        role: USER_ROLE_IN_ORG,
        // assignedBy: user.id, // Optional: who assigned the role
      },
    });
    console.log(`User ${user.id} is now assigned to organization ${organization.name} (ID: ${organization.id}) with role ${userOnOrg.role}.`);
  } catch (e) {
    // For other errors during upsert, just log them for this script
    console.error(`Failed to assign user to organization during upsert:`, e);
  }
}

main()
  .catch((e) => {
    console.error("Script failed overall:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log("Script finished.");
  }); 