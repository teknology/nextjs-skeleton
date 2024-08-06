const bcrypt = require('bcryptjs');
const saltRounds = 10;

export async function saltAndHashPassword(password: string): Promise<string> {

  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
}

export async function comparePasswords(formPassword: string, dbPassword: string): Promise<boolean> {

  const passwordsMatch = await bcrypt.compare(formPassword, dbPassword);
  if (passwordsMatch) return true;
  return false;

}