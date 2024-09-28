// /app/invite/[token]/page.tsx
import { useState } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button, Input, Spacer, Card } from '@nextui-org/react';
import { handleInviteForm } from './action';

export default function AcceptInvite({ params }: { params: { token: string } }) {
  const { token } = params;
  const { data: session } = useSession(); // Check if user is logged in
  const router = useRouter();

  const [isRegistering, setIsRegistering] = useState(false); // Toggle between login and register
  const [error, setError] = useState('');

  const handleFormSubmit = async (formData: FormData) => {
    try {
      // If user is logged in, accept the invite using their session ID
      if (session?.user?.id) {
        await handleInviteForm(formData, token, session.user.id);
      } else {
        // For new registration flow (without user ID)
        await handleInviteForm(formData, token);
      }
    } catch (error: any) {
      setError(error.message || 'Something went wrong.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <Card className="max-w-md w-full p-6 bg-white shadow-md rounded-md">
        <h1 className="text-2xl text-center">
          You're invited to join the team!
        </h1>

        {error && (
          <p className="text-red-500 text-center mt-2">{error}</p>
        )}

        {!session ? (
          <div className="mt-4">
            <div className="flex justify-center space-x-4">
              <Button
                className="bg-blue-500 hover:bg-blue-600"
                onClick={() => setIsRegistering(false)}
              >
                Login
              </Button>
              <Button
                className="bg-green-500 hover:bg-green-600"
                onClick={() => setIsRegistering(true)}
              >
                Register
              </Button>
            </div>

            <Spacer y={2} />

            {isRegistering ? (
              <form
                action={handleFormSubmit}
                className="flex flex-col space-y-4"
              >
                <Input
                  name="email"
                  type="email"
                  placeholder="Email"

                  required
                  className="w-full"
                />
                <Input
                  name="password"
                  type="password"
                  placeholder="Password"

                  required
                  className="w-full"
                />
                <Spacer y={1} />
                <Button
                  type="submit"
                  className="bg-green-500 hover:bg-green-600 w-full"
                >
                  Register and Join
                </Button>
              </form>
            ) : (
              <form
                action={handleFormSubmit}
                className="flex flex-col space-y-4"
              >
                <Input
                  name="email"
                  type="email"
                  placeholder="Email"
                  required
                  className="w-full"
                />
                <Input
                  name="password"
                  type="password"
                  placeholder="Password"
                  required
                  className="w-full"
                />
                <Spacer y={1} />
                <Button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 w-full"
                >
                  Login and Join
                </Button>
              </form>
            )}
          </div>
        ) : (
          <p className="text-center mt-4">
            You are logged in and the invitation is being processed...
          </p>
        )}
      </Card>
    </div>
  );
}
