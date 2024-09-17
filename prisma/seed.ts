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
    if (await tableExists('AccountAddress')) await prisma.accountAddress.deleteMany({});
    if (await tableExists('Address')) await prisma.address.deleteMany({});
    if (await tableExists('Profile')) await prisma.profile.deleteMany({});
    if (await tableExists('Session')) await prisma.session.deleteMany({});
    if (await tableExists('Authenticator')) await prisma.authenticator.deleteMany({});
    if (await tableExists('VerificationToken')) await prisma.verificationToken.deleteMany({});
    if (await tableExists('User')) await prisma.user.deleteMany({});
    if (await tableExists('Role')) await prisma.role.deleteMany({});
    if (await tableExists('CountryCode')) await prisma.countryCode.deleteMany({});
    if (await tableExists('Locale')) await prisma.locale.deleteMany({});
    if (await tableExists('AccountType')) await prisma.accountType.deleteMany({});

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

    // Seed account types using upsert
    const accountTypes = ['Personal', 'Business', 'Partner'];
    for (const type of accountTypes) {
        await prisma.accountType.upsert({
            where: { name: type },
            update: {},
            create: { name: type },
        });
    }
    console.log('Seeded AccountTypes:', accountTypes.join(', '));

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

    // Seed a user without a profile, and create an account separately
    const user = await prisma.user.create({
        data: {
            username: 'johndoe',
            password: await saltAndHashPassword('1234567'),
            appearance: {
                create: {
                    theme: 'light',
                },
            },
        },
    });
    console.log('Seeded user:', { user });

    // Seed an account for the user
    const account = await prisma.account.create({
        data: {
            userId: user.id,
            type: 'Personal',
            localeId: usLocale.id,
        },
    });
    console.log('Seeded account for user ID:', user.id);

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

    // Associate addresses with accounts instead of profiles
    await prisma.accountAddress.create({
        data: {
            accountId: account.id,
            addressId: homeAddress.id,
            isBilling: true,
        },
    });
    await prisma.accountAddress.create({
        data: {
            accountId: account.id,
            addressId: businessAddress.id,
            isBilling: false,
            isMailing: true,
        },
    });
    console.log(`Seeded account addresses for user ID: ${user.id}`);

    // Assign default 'Personal' account type to the user
    const personalAccountType = await prisma.accountType.findFirst({
        where: { name: 'Personal' },
    });

    if (personalAccountType) {
        await prisma.account.update({
            where: { id: account.id },
            data: {
                accountTypes: {
                    connect: { id: personalAccountType.id },
                },
            },
        });
        console.log(`Seeded default 'Personal' account type for user ID: ${user.id}`);
    } else {
        console.error('Account type "Personal" not found!');
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
