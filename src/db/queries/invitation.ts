import { auth } from "@/auth";
import { db } from "@/db";
import { getCsrfToken } from "next-auth/react";

interface InviteData {
    email: string;
    roleId: string | null;
    accountId: string | null;
    tenantId: string | null;
    websiteId: string | null;
    token: string;
}

export async function createInviteTokenDB(data: InviteData) {
    const session = await auth(); // Get the authenticated session
    if (!session) {
        throw new Error('User not authenticated');
    }



    // Create the invitation in the database
    const { email, roleId, accountId, tenantId, websiteId, token } = data;

    const invitation = await db.invitation.create({
        data: {
            email,
            roleId: roleId ?? '', // Ensure roleId is a string
            inviterId: session?.user?.id ?? '', // Authenticated user as the inviter, default to empty string if undefined
            accountId,
            tenantId,
            websiteId,
            token,
            expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7-day expiry
        },
    });
}

export async function findInviteByToken(token: string) {
    // Find the invitation by token
    const invitation = await db.invitation.findUnique({
        where: { token },
    });
}

export async function acceptInvite(invitation: any) {
    await db.invitation.update({
        where: { id: invitation.id },
        data: { status: 'ACCEPTED' },
    });

}