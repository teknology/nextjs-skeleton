import nodemailer from 'nodemailer';
import { render } from '@react-email/render'; // Used to render email components
import React from 'react';
import InviteEmail from '../../emails/invite-email'; // Your React Email invite component

// Nodemailer setup (using environment variables for the email provider)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
});

// Send invite email
export async function sendInviteEmail(recipientEmail: string, token: string) {
    const inviteLink = `${process.env.NEXT_PUBLIC_APP_URL}/invite/accept?token=${token}`;

    // Render email using React Email component
    const html = render(React.createElement(InviteEmail, { inviteLink })); // Correctly create the element

    await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: recipientEmail,
        subject: 'You’ve been invited to join!',
        html,
    });
}
