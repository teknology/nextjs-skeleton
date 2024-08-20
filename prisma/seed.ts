import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    // Seed roles
    const adminRole = await prisma.role.upsert({
        where: { name: 'admin' },
        update: {},
        create: {
            name: 'admin',
        },
    });

    const userRole = await prisma.role.upsert({
        where: { name: 'user' },
        update: {},
        create: {
            name: 'user',
        },
    });

    console.log(`Seeded roles: ${adminRole.name}, ${userRole.name}`);

    // If you want to seed data related to a specific user, ensure it does not directly insert into the User table but rather uses existing User data.
    // Example: Assume you have an existing user with a known ID

    const existingUserId = 'clz4srp700000viydor9un7ru'; // Replace with an actual user ID from your database

    // Seed profile for the existing user
    const profile = await prisma.profile.upsert({
        where: { userId: existingUserId },
        update: {},
        create: {
            lastName: 'Doe',
            title: 'Software Engineer',
            biography: 'A passionate developer.',
            countryCode: 'US',
            phoneNumber: 1234567890,
            userId: existingUserId,
        },
    });

    console.log(`Seeded profile for user ID: ${existingUserId}`);

    // Seed user role for the existing user
    const userRoleAssignment = await prisma.userRole.upsert({
        where: {
            userId_roleId: {
                userId: existingUserId,
                roleId: userRole.id,
            },
        },
        update: {},
        create: {
            userId: existingUserId,
            roleId: userRole.id,
        },
    });

    console.log(`Assigned role to user: ${existingUserId}`);

    // Similarly, you can seed other related models like Account, Session, etc., but ensure they reference existing User records.
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
