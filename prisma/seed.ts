import { PrismaClient } from '@prisma/client';
import { country_codes as countryCodes } from '@/utils/data/country-codes';
import { saltAndHashPassword } from '@/utils/auth';

const prisma = new PrismaClient();

// Function to clear the database
async function clearDatabase() {
    console.log('Clearing database...');

    // Deletion order is crucial due to foreign key constraints
    await prisma.userRole.deleteMany({});
    await prisma.profile.deleteMany({});
    await prisma.account.deleteMany({});
    await prisma.session.deleteMany({});
    await prisma.authenticator.deleteMany({});
    await prisma.verificationToken.deleteMany({});
    await prisma.user.deleteMany({});
    await prisma.role.deleteMany({});
    await prisma.countryCode.deleteMany({});

    console.log('Database cleared.');
}

// Main function to seed the database
async function main() {
    // Clear the database
    await clearDatabase();

    // Seed the CountryCode table with all fields using `create`
    for (const countryCode of countryCodes) {
        await prisma.countryCode.create({
            data: {
                code: countryCode.code,
                country: countryCode.country,
                alpha2: countryCode.alpha2,
                alpha3: countryCode.alpha3,
                flag: countryCode.flag,
            },
        });
    }

    console.log('Seeded CountryCodes');

    // Seed roles
    const adminRole = await prisma.role.create({
        data: {
            name: 'admin',
        },
    });

    const userRole = await prisma.role.create({
        data: {
            name: 'user',
        },
    });

    console.log(`Seeded roles: ${adminRole.name}, ${userRole.name}`);

    // Find the existing US country code using `findFirst`
    const usCountryCode = await prisma.countryCode.findFirst({
        where: { alpha2: 'US' },
    });

    if (!usCountryCode) {
        console.error('US country code not found!');
        process.exit(1);
    }

    // Seed a user with a profile
    const user = await prisma.user.create({
        data: {
            username: 'johndoe',
            emailVerifiedDate: new Date(),
            email: 'gary@magehd.com',
            emailVerified: true,

            // Example password hash, in a real scenario, you'd hash the password before storing
            password: await saltAndHashPassword('1234567'),
            profile: {
                create: {
                    firstName: 'John',
                    lastName: 'Doe',
                    title: 'Developer',
                    biography: 'Experienced software developer.',
                    countryCodeId: usCountryCode.id, // Linking the country code
                    phoneNumber: '1234567890',
                    timezoneId: 4, // Assuming you have a timezone ID
                },
            },
        },
    });

    console.log('Seed data created:', { user });

    console.log(`Seeded profile for user ID: ${user.id}`);

    // Seed user role for the user
    await prisma.userRole.create({
        data: {
            userId: user.id,
            roleId: userRole.id,
        },
    });

    console.log(`Assigned role to user: ${user.id}`);

    // Similarly, you can seed other related models like Authenticator if needed.
}

// Execute the main function
main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
