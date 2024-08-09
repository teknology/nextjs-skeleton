import type { User } from '@prisma/client';
import { db } from '@/db';
import { saltAndHashPassword } from '@/utils/auth';

export type { User };

/**
 * Get a user by their email address.
 * @param email The email address of the user.
 * @returns The user with the given email address, or null if no user was found.
 */
export async function getUserByEmail(email: string) {

  //console.log(email);
  //return null;
  const result = null;


  try {
    const result = await db.user.findUnique({
      where: { email },
    });
    console.log(result);
    return result;

  }
  catch (error) {


    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }



  return result;
}

/**
 * Get a user by their ID.
 * @param id The ID of the user.
 * @returns The user with the given ID, or null if no user was found.
 */
export async function getUserById(id: string): Promise<User | null> {
  return await db.user.findUnique({
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
  const hashedPassword = await saltAndHashPassword(password);

  try {
    return await db.user.create({
      data: {
        email: email,
        password: hashedPassword
      }
    })
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
    })
  }
  catch (error) {
    console.error('Failed to update user:', error);
    throw new Error('Failed to update user.');
  } //I added this line

}
