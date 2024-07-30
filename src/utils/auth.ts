const bcrypt = require('bcryptjs');
const saltRounds = 10;

export async function saltAndHashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, saltRounds);
}

export async function comparePasswords(formPassword: string, dbPassword: string): Promise<boolean> {
  return bcrypt.compare(formPassword, dbPassword);
}