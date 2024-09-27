// emails/InviteEmail.tsx
import React from 'react';
import { Html, Head, Preview, Body, Container, Heading, Button } from '@react-email/components';

export const InviteEmail = ({ inviteLink }: { inviteLink: any }) => (
    <Html>
        <Head />
        <Preview>You're invited to join a team!</Preview>
        <Body>
            <Container>
                <Heading>You’ve been invited!</Heading>
                <p>Click the button below to accept your invitation:</p>
                <Button href={inviteLink} style={{ backgroundColor: '#007bff', color: '#fff' }}>
                    Accept Invitation
                </Button>
            </Container>
        </Body>
    </Html>
);

export default InviteEmail;