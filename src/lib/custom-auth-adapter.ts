/*
 * Copyright © Mage H.D. Inc. 2024. All Rights Reserved.
 *
 * This source code, its associated files, and any related documentation ("Code") are proprietary intellectual property owned by Mage H.D. Inc. The Code is protected under applicable copyright laws, intellectual property rights, and international treaties.
 *
 * Unauthorized use, reproduction, modification, distribution, transmission, storage, or disclosure of this Code, in whole or in part, without the explicit prior written consent of Mage H.D. Inc., is strictly prohibited. Any such unauthorized actions may result in civil and criminal penalties under applicable laws.
 *
 * This Code is licensed solely for the authorized use by Mage H.D. Inc. or its expressly authorized partners, clients, or customers. Any use of this Code shall be governed by the terms and conditions of applicable agreements, such as licensing agreements or development contracts.
 *
 * Mage H.D. Inc. disclaims any and all liability for misuse or unintended use of this Code. This Code is provided "as is" without any warranties, express or implied, including but not limited to warranties of merchantability, fitness for a particular purpose, or non-infringement.
 *
 * For inquiries, licensing requests, or permissions related to this Code, please contact:
 *
 * Gary Pettigrew
 * Mage H.D. Inc.
 * Email: hello@magehd.com
 */

import { Adapter } from "next-auth/adapters";
import { PrismaClient } from "@prisma/client";
import type { AdapterUser } from "@/utils/types/types";
import { AdapterAccount, AdapterSession, PrismaUserWithProfile, VerificationToken } from "@/utils/types/types";

const prisma = new PrismaClient();

function mapPrismaUserToAdapterUser(prismaUser: PrismaUserWithProfile): AdapterUser {
    return {
        id: prismaUser.id,
        email: prismaUser.profile?.email ?? "",
        emailVerified: prismaUser.profile?.emailVerifiedDate || null,
        username: prismaUser.username || undefined,
        image: prismaUser.image || undefined,
        name: prismaUser.username || undefined,

    };
}


export function CustomProviderAccountAdapter(): Adapter {
    return {
        createUser: async function (user: AdapterUser): Promise<AdapterUser> {
            const prismaUser = await prisma.user.create({
                data: {
                    username: user.name || "",
                    image: user.image || null,
                    profile: {
                        create: {
                            email: user.email || "",
                            emailVerifiedDate: user.emailVerified ? new Date() : null,
                            // localeId: 'en', // Removed localeId as it is not a known property
                            isEmailVerified: !!user.emailVerified,
                        },
                    },
                },
                include: { profile: true },
            });

            return mapPrismaUserToAdapterUser(prismaUser);
        }
        ,

        async getUser(id: string): Promise<AdapterUser | null> {
            const prismaUser = await prisma.user.findUnique({
                where: { id },
                include: { profile: true },
            });
            return prismaUser ? mapPrismaUserToAdapterUser(prismaUser as PrismaUserWithProfile) : null;
        },

        async getUserByEmail(email: string): Promise<AdapterUser | null> {
            const prismaUser = await prisma.user.findFirst({
                where: { profile: { email } },
                include: { profile: true }, // Include the profile data to ensure it's populated
            });

            return prismaUser ? mapPrismaUserToAdapterUser(prismaUser as PrismaUserWithProfile) : null;
        },

        async getUserByAccount({ provider, providerAccountId }: { provider: string; providerAccountId: string }): Promise<AdapterUser | null> {
            const account = await prisma.providerAccount.findUnique({
                where: {
                    provider_providerAccountId: {
                        provider,
                        providerAccountId,
                    },
                },
            });
            if (!account) return null;

            const prismaUser = await prisma.user.findUnique({
                where: { id: account.userId },
                include: { profile: true },
            });
            return prismaUser ? mapPrismaUserToAdapterUser(prismaUser as PrismaUserWithProfile) : null;
        },

        async updateUser(user: Partial<AdapterUser> & Pick<AdapterUser, 'id'>): Promise<AdapterUser> {
            const updatedUser = await prisma.user.update({
                where: { id: user.id },
                data: {
                    username: user.username || undefined,
                    image: user.image || undefined,
                    profile: {
                        update: {
                            email: user.email || undefined,
                            emailVerifiedDate: user.emailVerified ?? undefined,
                            isEmailVerified: user.emailVerified ? true : undefined,
                        },
                    },
                },
                include: { profile: true },
            });

            return mapPrismaUserToAdapterUser(updatedUser);
        },

        async deleteUser(userId: string): Promise<void> {
            await prisma.user.delete({
                where: { id: userId },
            });
        },

        async linkAccount(account: AdapterAccount): Promise<void> {
            await prisma.providerAccount.create({
                data: {
                    userId: account.userId,
                    provider: account.provider,
                    providerAccountId: account.providerAccountId,
                    accessToken: account.access_token,
                    refreshToken: account.refresh_token,
                    tokenType: account.token_type,
                    idToken: account.id_token,
                    scope: account.scope,
                    expiresAt: account.expires_at,
                },
            });
        },

        async unlinkAccount({ provider, providerAccountId }: { provider: string; providerAccountId: string }): Promise<void> {
            await prisma.providerAccount.delete({
                where: {
                    provider_providerAccountId: {
                        provider,
                        providerAccountId,
                    },
                },
            });
        },

        async createSession(session: AdapterSession): Promise<AdapterSession> {
            if (!session.userId) {
                throw new Error("Session cannot be created without a valid userId.");
            }

            const createdSession = await prisma.session.create({
                data: {
                    sessionToken: session.sessionToken,
                    userId: session.userId,
                    expires: session.expires,
                },
            });

            return {
                ...createdSession,
                userId: createdSession.userId as string, // Assert userId as non-nullable
            };
        },


        async getSessionAndUser(sessionToken: string): Promise<{ session: AdapterSession; user: AdapterUser } | null> {
            const session = await prisma.session.findUnique({
                where: { sessionToken },
                include: { user: { include: { profile: true } } },
            });
            console.log("getSessionAndUser called with token:", sessionToken);

            // Return null if session or user is not found, or if userId is null
            if (!session || !session.user || !session.userId) return null;

            return {
                session: {
                    sessionToken: session.sessionToken,
                    userId: session.userId, // Now guaranteed to be non-null
                    expires: session.expires,
                },
                user: mapPrismaUserToAdapterUser(session.user),
            };
        }
        ,

        async updateSession(session: AdapterSession): Promise<AdapterSession> {
            const updatedSession = await prisma.session.update({
                where: { sessionToken: session.sessionToken },
                data: { expires: session.expires },
            });

            return {
                ...updatedSession,
                userId: updatedSession.userId!, // Non-null assertion for userId
            };
        },



        async deleteSession(sessionToken: string): Promise<void> {
            await prisma.session.delete({
                where: { sessionToken },
            });
        },

        async createVerificationToken(verificationToken: VerificationToken): Promise<VerificationToken> {
            return prisma.verificationToken.create({
                data: {
                    identifier: verificationToken.identifier,
                    token: verificationToken.token,
                    expires: verificationToken.expires,
                },
            });
        },

        async useVerificationToken({ identifier, token }: { identifier: string; token: string }): Promise<VerificationToken | null> {
            try {
                const verificationToken = await prisma.verificationToken.findUnique({
                    where: {
                        identifier_token: {
                            identifier,
                            token,
                        },
                    },
                });
                if (!verificationToken) return null;

                await prisma.verificationToken.delete({
                    where: {
                        identifier_token: {
                            identifier,
                            token,
                        },
                    },
                });
                return verificationToken;
            } catch {
                return null;
            }
        },
    };
}
