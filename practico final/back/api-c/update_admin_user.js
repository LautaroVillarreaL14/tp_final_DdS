const Database = require('better-sqlite3');
const bcrypt = require('bcrypt');

const dbPath = 'db_sqlite.sqlite';
const email = 'lautarovillarreal2018@gmail.com';
const newPassword = '12345678';
const newRole = 'admin';

const db = new Database(dbPath);
const user = db.prepare('SELECT id, email, role, password FROM user WHERE email = ?').get(email);
if (!user) {
  console.error('USER_NOT_FOUND');
  process.exit(1);
}

const hash = bcrypt.hashSync(newPassword, 10);
db.prepare('UPDATE user SET password = ?, role = ? WHERE id = ?').run(hash, newRole, user.id);
const updated = db.prepare('SELECT id, email, role, password FROM user WHERE id = ?').get(user.id);
console.log(JSON.stringify({ before: user, after: updated }, null, 2));
db.close();
