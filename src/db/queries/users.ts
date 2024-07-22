import type { User } from '@prisma/client';
import { db } from '@/db';

export type { User };

/**
 * Get a user by their email address.
 * @param email The email address of the user.
 * @returns The user with the given email address, or null if no user was found.
 */
export async function getUserByEmail(email: string): Promise<User | null> {
  try {
    return await db.user.findUnique({
      where: { email },
    });
  }
  catch (error) {

    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }

}

/**
 * Get a user by their ID.
 * @param id The ID of the user.
 * @returns The user with the given ID, or null if no user was found.
 */
export async function getUserById(id: string): Promise<User | null> {
  return db.user.findUnique({
    where: { id },
  });
}

/**
 * Create a new user.
 * @param email The email address of the user.
 * @param password The password of the user.
 * @returns The newly created user.
 */
export async function createUser(email: string, password: string): Promise<User> {
  return db.user.create({
    data: {
      email: email as string,
      password: password as string,
    },
  });
}
