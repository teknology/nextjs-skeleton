import { PrismaClient } from '@prisma/client';
import { country_codes as countryCodes } from '@/utils/data/country-codes';
import { locales } from '@/utils/data/locale';
import { saltAndHashPassword } from '@/utils/auth';

const prisma = new PrismaClient();

async function tableExists(tableName: string): Promise<boolean> {
    const result = await prisma.$queryRaw<Array<{ exists: boolean }>>`
        SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = ${tableName})`;
    return result[0].exists;
}

async function clearDatabase() {
    console.log('Clearing database...');

    if (await tableExists('UserRole')) await prisma.userRole.deleteMany({});
    if (await tableExists('ProfileAddress')) await prisma.profileAddress.deleteMany({});
    if (await tableExists('Address')) await prisma.address.deleteMany({});
    if (await tableExists('Profile')) await prisma.profile.deleteMany({});
    if (await tableExists('Session')) await prisma.session.deleteMany({});
    if (await tableExists('Authenticator')) await prisma.authenticator.deleteMany({});
    if (await tableExists('VerificationToken')) await prisma.verificationToken.deleteMany({});
    if (await tableExists('User')) await prisma.user.deleteMany({});
    if (await tableExists('Role')) await prisma.role.deleteMany({});
    if (await tableExists('CountryCode')) await prisma.countryCode.deleteMany({});
    if (await tableExists('Locale')) await prisma.locale.deleteMany({});
    if (await tableExists('ProfileType')) await prisma.profileType.deleteMany({});

    console.log('Database cleared.');
}

async function seedDatabase() {
    await clearDatabase();

    // Seed the CountryCode table with states if they exist
    for (const countryCode of countryCodes) {
        const createdCountry = await prisma.countryCode.create({
            data: {
                code: countryCode.code,
                country: countryCode.country,
                alpha2: countryCode.alpha2,
                alpha3: countryCode.alpha3,
                flag: countryCode.flag,
            },
        });

        if (countryCode.states && countryCode.states.length > 0) {
            for (const state of countryCode.states) {
                await prisma.stateProvince.create({
                    data: {
                        name: state.name,
                        code: state.code,
                        countryCodeId: createdCountry.id,
                    },
                });
            }
            console.log(`Seeded ${countryCode.states.length} states for ${countryCode.country}`);
        }
    }
    console.log('Seeded CountryCodes and States');

    // Seed locales
    await prisma.locale.createMany({
        data: locales,
    });
    console.log('Seeded Locales');

    // Seed roles
    const adminRole = await prisma.role.create({
        data: { name: 'admin' },
    });
    const userRole = await prisma.role.create({
        data: { name: 'user' },
    });
    console.log(`Seeded roles: ${adminRole.name}, ${userRole.name}`);

    // Seed profile types using upsert
    const profileTypes = ['Personal', 'Business', 'Partner'];
    for (const type of profileTypes) {
        await prisma.profileType.upsert({
            where: { name: type },
            update: {},
            create: { name: type },
        });
    }
    console.log('Seeded ProfileTypes:', profileTypes.join(', '));

    // Find the existing US country code and locale
    const usCountryCode = await prisma.countryCode.findFirst({
        where: { alpha2: 'US' },
    });
    const usLocale = await prisma.locale.findFirst({
        where: { code: 'en' },
    });

    if (!usCountryCode) {
        console.error('US country code not found!');
        process.exit(1);
    }
    if (!usLocale) {
        console.error('US locale not found!');
        process.exit(1);
    }

    // Seed a user with a profile, linking to countryCodeId
    const user = await prisma.user.create({
        data: {
            username: 'johndoe',
            emailVerifiedDate: new Date(),
            email: 'gary@magehd.com',
            emailVerified: true,
            password: await saltAndHashPassword('1234567'),
            profile: {
                create: {
                    firstName: 'John',
                    lastName: 'Doe',
                    title: 'Developer',
                    biography: 'Experienced software developer.',
                    phoneNumber: 1234567890,
                    timezoneId: 4,
                    localeId: usLocale?.id,
                    countryCodeId: usCountryCode.id,
                },
            },
            appearance: {
                create: {
                    theme: 'light',
                },
            },
        },
    });
    console.log('Seeded user and profile:', { user });

    // Fetch the user’s profile
    const profile = await prisma.profile.findUnique({
        where: { userId: user.id },
    });

    if (!profile) {
        console.error('Profile not found!');
        process.exit(1);
    }

    // Find the state "California" for the US
    const californiaState = await prisma.stateProvince.findFirst({
        where: { code: 'CA', countryCodeId: usCountryCode.id },
    });

    if (!californiaState) {
        console.error('California state not found!');
        process.exit(1);
    }

    // Seed addresses
    const homeAddress = await prisma.address.create({
        data: {
            address1: '123 Home St',
            address2: 'Apt 4B',
            city: 'Hometown',
            stateProvinceId: californiaState.id,
            zipcode: '12345',
            countryCodeId: usCountryCode.id,
            addressType: 'RESIDENTIAL', // Use enum value
        },
    });
    const businessAddress = await prisma.address.create({
        data: {
            address1: '456 Business Ave',
            address2: 'Suite 101',
            city: 'Businesstown',
            stateProvinceId: californiaState.id,
            zipcode: '67890',
            countryCodeId: usCountryCode.id,
            addressType: 'COMMERCIAL', // Use enum value
        },
    });
    console.log('Seeded addresses.');

    // Associate addresses with profiles
    await prisma.profileAddress.create({
        data: {
            profileId: profile.id,
            addressId: homeAddress.id,
            isBilling: true,
        },
    });
    await prisma.profileAddress.create({
        data: {
            profileId: profile.id,
            addressId: businessAddress.id,
            isBilling: false,
            isMailing: true,
        },
    });
    console.log(`Seeded profile addresses for user ID: ${user.id}`);

    // Assign default 'Personal' profile type to the user
    const personalProfileType = await prisma.profileType.findFirst({
        where: { name: 'Personal' },
    });

    if (personalProfileType) {
        await prisma.profile.update({
            where: { id: profile.id },
            data: {
                profileTypes: {
                    connect: { id: personalProfileType.id },
                },
            },
        });
        console.log(`Seeded default 'Personal' profile type for user ID: ${user.id}`);
    } else {
        console.error('Profile type "Personal" not found!');
    }
}

async function main() {
    try {
        await seedDatabase();
    } catch (e) {
        console.error(e);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();
