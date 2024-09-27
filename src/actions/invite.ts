import { createInviteTokenDB } from '@/db/queries/invitation';
import { sendInviteEmail } from '@/lib/mailer';
import { inviteSchema } from '@/utils/validation-schemas';
import { randomBytes } from 'crypto';

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

interface AcceptInviteFormState {
    status?: 'idle' | 'success' | 'error';
    errors: {
        _form?: string[];
    };
}
export async function acceptInvite(formState: AcceptInviteFormState, formData: FormData): Promise<AcceptInviteFormState> {

}