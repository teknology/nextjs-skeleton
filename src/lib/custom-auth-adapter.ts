import { Adapter, AdapterUser, AdapterSession, AdapterAccount, VerificationToken } from 'next-auth/adapters'
import { PrismaClient, User } from '@prisma/client'

const prisma = new PrismaClient()

type PrismaUserWithProfile = User & {
    profile: {
        id: string;
        firstName: string | null;
        lastName: string | null;
        title: string | null;
        biography: string | null;
        phoneNumber: number | null;
        userId: string;
        timezoneId: number | null;
        countryCodeId: number | null;
        email: string;
        emailVerifiedDate: Date | null;
        emailVerified: boolean;
    } | null;
};

// Helper function to transform PrismaUser into AdapterUser, considering the expanded profile structure
function mapPrismaUserToAdapterUser(prismaUser: PrismaUserWithProfile): AdapterUser {
    return {
        id: prismaUser.id,
        email: prismaUser.profile?.email ?? '', // Provide a default value if email is undefined
        emailVerified: prismaUser.profile?.emailVerifiedDate || null, // Handle case when profile is null
        name: prismaUser.username || null, // Default to null if username is missing
        image: prismaUser.image || null, // Default to null if image is missing
    };
}

export function CustomProviderAccountAdapter(): Adapter {
    return {
        async createUser(user): Promise<AdapterUser> {
            const prismaUser = await prisma.user.create({
                data: {
                    username: user.name,
                    image: user.image || null, // Use the image from the provider if available
                    profile: {
                        create: {
                            email: user.email,
                            emailVerifiedDate: user.emailVerified ? new Date() : null,
                            emailVerified: !!user.emailVerified, // Cast emailVerified to boolean
                        },
                    },
                },
                include: { profile: true }, // Ensure Profile is included in the result
            })
            return mapPrismaUserToAdapterUser(prismaUser)
        },

        async getUser(id): Promise<AdapterUser | null> {
            const prismaUser = await prisma.user.findUnique({
                where: { id },
                include: { profile: true }, // Ensure Profile is included in the result
            }) as PrismaUserWithProfile;
            return prismaUser ? mapPrismaUserToAdapterUser(prismaUser) : null
        },

        async getUserByEmail(email): Promise<AdapterUser | null> {
            const prismaProfile = await prisma.profile.findUnique({
                where: { email },
                include: { user: true }, // Ensure the user relation is included
            })

            const prismaUser = prismaProfile ? prismaProfile.user as PrismaUserWithProfile : null;
            return prismaUser ? mapPrismaUserToAdapterUser(prismaUser) : null;
        },

        async getUserByAccount({ provider, providerAccountId }): Promise<AdapterUser | null> {
            const account = await prisma.providerAccount.findUnique({
                where: {
                    provider_providerAccountId: {
                        provider,
                        providerAccountId,
                    },
                },
            })
            if (!account) return null

            const prismaUser = await prisma.user.findUnique({
                where: { id: account.userId },
                include: { profile: true }, // Ensure Profile is included in the result
            }) as PrismaUserWithProfile;
            return prismaUser ? mapPrismaUserToAdapterUser(prismaUser) : null
        },

        async updateUser(user): Promise<AdapterUser> {
            const existingUser = await prisma.user.findUnique({
                where: { id: user.id },
            });

            const updatedUser = await prisma.user.update({
                where: { id: user.id },
                data: {
                    username: user.name,
                    image: existingUser?.image || user.image, // If the image in the database is null, use the provider image
                    profile: {
                        update: {
                            email: user.email,
                            emailVerifiedDate: user.emailVerified ? new Date() : null,
                        },
                    },
                },
                include: { profile: true }, // Ensure Profile is included in the result
            })
            return mapPrismaUserToAdapterUser(updatedUser)
        },

        async deleteUser(userId): Promise<void> {
            await prisma.user.delete({
                where: { id: userId },
            })
        },

        async linkAccount(account: AdapterAccount): Promise<void> {
            await prisma.providerAccount.create({
                data: {
                    userId: account.userId,
                    provider: account.provider,
                    providerAccountId: account.providerAccountId,
                    accessToken: account.accessToken as string | undefined,
                    refreshToken: account.refreshToken as string | null | undefined,
                    expiresAt: account.expires_at ? Math.floor(account.expires_at / 1000) : null,
                    idToken: account.id_token,
                    scope: account.scope,
                    tokenType: account.token_type,
                    sessionState: account.session_state as string | undefined,
                },
            })
        },

        async unlinkAccount({ provider, providerAccountId }): Promise<void> {
            await prisma.providerAccount.delete({
                where: {
                    provider_providerAccountId: {
                        provider,
                        providerAccountId,
                    },
                },
            })
        },

        async createSession(session: AdapterSession): Promise<AdapterSession> {
            return prisma.session.create({
                data: {
                    sessionToken: session.sessionToken,
                    userId: session.userId,
                    expires: session.expires,
                },
            })
        },

        async getSessionAndUser(sessionToken): Promise<{ session: AdapterSession; user: AdapterUser } | null> {
            const session = await prisma.session.findUnique({
                where: { sessionToken },
                include: { user: { include: { profile: true } } }, // Ensure Profile is included
            })

            if (!session || !session.user) return null

            return {
                session: {
                    sessionToken: session.sessionToken,
                    userId: session.userId,
                    expires: session.expires,
                },
                user: mapPrismaUserToAdapterUser(session.user),
            }
        },

        async updateSession(session: AdapterSession): Promise<AdapterSession> {
            return prisma.session.update({
                where: { sessionToken: session.sessionToken },
                data: {
                    expires: session.expires,
                },
            })
        },

        async deleteSession(sessionToken): Promise<void> {
            await prisma.session.delete({
                where: { sessionToken },
            })
        },

        async createVerificationToken(verificationToken: VerificationToken): Promise<VerificationToken> {
            return prisma.verificationToken.create({
                data: {
                    identifier: verificationToken.identifier,
                    token: verificationToken.token,
                    expires: verificationToken.expires,
                },
            })
        },

        async useVerificationToken({ identifier, token }): Promise<VerificationToken | null> {
            try {
                const verificationToken = await prisma.verificationToken.findUnique({
                    where: {
                        identifier_token: {
                            identifier,
                            token,
                        },
                    },
                })
                if (!verificationToken) return null

                await prisma.verificationToken.delete({
                    where: {
                        identifier_token: {
                            identifier,
                            token,
                        },
                    },
                })
                return verificationToken
            } catch (error) {
                return null
            }
        },
    }
}
