import type { Profile, User } from '@prisma/client';
import { db } from '@/db';
import { saltAndHashPassword } from '@/utils/auth';
import { auth } from '@/auth';

export type { User };
export type { Profile };

interface UserWithProfile extends User {
  profile: Profile | null; // Lowercase 'profile'
}


/**
 * Get a user by their email address.
 * @param email The email address of the user.
 * @returns The user with the given email address, or null if no user was found.
 */
export async function getUserByEmail(userEmail: string) {
  const result = await db.user.findFirst({
    where: {
      profile: {
        email: userEmail,
      },
    },
    include: {
      profile: true, // Ensure profile is included
    },
  });
  return result;
}

/**
 * Get a user by their ID.
 * @param id The ID of the user.
 * @returns The user with the given ID, or null if no user was found.
 */
export async function getUserById(userId: string = ""): Promise<User | null> {
  const session = await auth();

  if (userId === "") {
    userId = session?.user?.id as string;
  }

  return await db.user.findUnique({
    where: { id: userId },
  });
}

/**
 * Get a user by their ID, including the profile.
 * @param id The ID of the user.
 * @returns The user with the given ID, or null if no user was found.
 */
export async function getUserWithProfileById(userId: string = ""): Promise<UserWithProfile | null> {
  const session = await auth();

  if (userId === "") {
    userId = session?.user?.id as string;
  }

  const user = await db.user.findUnique({
    where: { id: userId },
    include: {
      profile: true, // Include the profile relation
    },
  });

  // Map the profile to the expected structure
  return user;
}

/**
 * Create a new user.
 * @param email The email address of the user.
 * @param password The password of the user.
 * @returns The newly created user.
 */
export async function createUser(email: string, password: string): Promise<User> {
  const hashedPassword = await saltAndHashPassword(password);

  try {
    // Retrieve the "Personal" account type from the database
    const personalAccountType = await db.accountType.findUnique({
      where: {
        name: 'Personal',
      },
    });

    if (!personalAccountType) {
      throw new Error('Account type "Personal" not found.');
    }

    // Create the user and associated profile
    return await db.user.create({
      data: {
        accounts: {
          create: {
            type: 'Personal', // Add the required type property
            localeId: null, // Example locale, adjust as needed
            accountTypes: {
              connect: { id: personalAccountType.id }, // Automatically associate "Personal" account type
            },
          },
        },
        profile: {
          create: {
            email: email,
          },
        },
        password: hashedPassword,
      },
    });
  } catch (error) {
    console.error('Failed to create user:', error);
    throw new Error('Failed to create user.');
  }
}

/**
 * Update the user's email.
 * @param id The ID of the user.
 * @param email The new email address.
 * @returns The updated user.
 */
export async function updateUserEmail(id: string, email: string): Promise<User> {
  try {
    return await db.user.update({
      where: { id },
      data: {
        profile: {
          update: {
            email: email,
          },
        },
      },
    });
  } catch (error) {
    console.error('Failed to update user email:', error);
    throw new Error('Failed to update user email.');
  }
}

/**
 * Update the user's avatar.
 * @param id The ID of the user.
 * @param avatar The new avatar URL.
 * @returns The updated user.
 */
export async function updateUserAvatar(id: string, avatar: string): Promise<User> {
  try {
    return await db.user.update({
      where: { id },
      data: {
        image: avatar,
      },
    });
  } catch (error) {
    console.error('Failed to update user avatar:', error);
    throw new Error('Failed to update user avatar.');
  }
}

/**
 * Update the user and their profile.
 * @param data The user data to update.
 * @returns The updated user.
 */
export async function updateUserWithProfile(data: User): Promise<User> {
  const session = await auth();
  const userId = session?.user?.id as string;

  if (!userId) {
    throw new Error('User not authenticated.');
  }

  try {
    return await db.user.update({
      where: { id: userId },
      data: {
        ...data,
      },
    });
  } catch (error) {
    console.error('Failed to update user:', error);
    throw new Error('Failed to update user.');
  }
}
