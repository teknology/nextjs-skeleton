import type { Profile, User } from '@prisma/client';
import { db } from '@/db';
import { saltAndHashPassword } from '@/utils/auth';
import { auth } from '@/auth';
import { user } from '@nextui-org/react';

export type { User };
export type { Profile };

/**
 * Get a user by their email address.
 * @param email The email address of the user.
 * @returns The user with the given email address, or null if no user was found.
 */
export async function getUserByEmail(userEmail: string) {

  const result = await db.user.findFirst({
    where: {
      email: userEmail,
    },
  });

  console.log('db call', result);
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
 * Create a new user.
 * @param email The email address of the user.
 * @param password The password of the user.
 * @returns The newly created user.
 */
export async function createUser(email: string, password: string): Promise<User> {
  const hashedPassword = await saltAndHashPassword(password);

  try {
    return await db.user.create({
      data: {
        password: hashedPassword,
        email: email,
      },
    });
  }
  catch (error) {
    console.error('Failed to create user:', error);
    throw new Error('Failed to create user.');
  }
}


export async function updateUserEmail(id: string, email: string): Promise<User> {
  try {
    return await db.user.update({
      where: { id },
      data: {
        email: email,
      }
    });
  }
  catch (error) {
    console.error('Failed to update user:', error);
    throw new Error('Failed to update user.');
  }

}


export async function updateUserAvatar(id: string, avatar: string): Promise<User> {
  try {
    return await db.user.update({
      where: { id },
      data: {
        image: avatar,
      }
    })
  }
  catch (error) {
    console.error('Failed to update user:', error);
    throw new Error('Failed to update user avatar.');
  }
}
