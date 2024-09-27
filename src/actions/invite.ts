import { createInviteTokenDB } from '@/db/queries/invitation';
import { sendInviteEmail } from '@/lib/mailer';
import { inviteSchema } from '@/utils/validation-schemas';
import { randomBytes } from 'crypto';
import bcrypt from 'bcrypt';
import { redirect } from 'next/navigation';

interface InviteFormState {
    status?: 'idle' | 'success' | 'error';
    errors: {
        email?: string[];
        _form?: string[];
    };
}

export async function sendTeamInvite(formState: InviteFormState, formData: FormData): Promise<InviteFormState> {
    const result = inviteSchema.safeParse({
        email: formData.get('email')
    });

    if (!result.success) {
        return {
            errors: result.error.flatten().fieldErrors
        };
    }

    const token = randomBytes(32).toString('hex');

    const inviteData = {
        email: result.data.email,
        roleId: "1",
        accountId: '1',
        tenantId: '1',
        websiteId: '1',
        token
    }

    try {
        const invitation = await createInviteTokenDB(inviteData)
        // Send the invite email with the token
        await sendInviteEmail(inviteData.email, token);
        return {
            status: 'success',
            errors: {}
        }

    }
    catch (error) {
        return {
            status: 'error',
            errors: {
                _form: ['Error sending invitation']
            }
        }
    }




}
export async function handleInviteForm(
    formData: FormData,
    token: string,
    userId?: string
) {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
        // Find the invitation by token
        const invitation = await prisma.invitation.findUnique({
            where: { token },
        });

        if (!invitation || invitation.expiresAt < new Date()) {
            throw new Error('Invalid or expired invitation.');
        }

        // If the userId is provided, accept the invite directly (for logged-in users)
        if (userId) {
            await prisma.userRole.create({
                data: {
                    userId,
                    roleId: invitation.roleId,
                    accountId: invitation.accountId,
                    tenantId: invitation.tenantId,
                    websiteId: invitation.websiteId,
                },
            });

            // Mark the invitation as accepted
            await prisma.invitation.update({
                where: { id: invitation.id },
                data: { status: 'ACCEPTED' },
            });

            return redirect('/dashboard');
        }

        // Check if user already exists (registration flow)
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            throw new Error('User already exists.');
        }

        // Hash the password and create a new user
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
            },
        });

        // Assign the role based on the invitation
        await prisma.userRole.create({
            data: {
                userId: newUser.id,
                roleId: invitation.roleId,
                accountId: invitation.accountId,
                tenantId: invitation.tenantId,
                websiteId: invitation.websiteId,
            },
        });

        // Mark the invitation as accepted
        await prisma.invitation.update({
            where: { id: invitation.id },
            data: { status: 'ACCEPTED' },
        });

        return redirect('/login'); // Redirect to login after registration
    } catch (error) {
        throw new Error(error.message || 'Something went wrong.');
    }
}

interface AcceptInviteFormState {
    status?: 'idle' | 'success' | 'error';
    errors: {
        _form?: string[];
    };
}
export async function acceptInvite(formState: AcceptInviteFormState, formData: FormData): Promise<AcceptInviteFormState> {

}