const bcrypt = require('bcrypt');
const saltRounds = 10;

export async function saltAndHashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, saltRounds, function(err, hash) {
    // Store hash in your password DB.
});
}

export async function comparePasswords(formPassword: string, dbPassword: string): Promise<boolean> {
  return bcrypt.compare(formPassword, dbPassword, function(err, result) {
    // result == true
});
}