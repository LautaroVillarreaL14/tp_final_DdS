const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');

const dbPath = path.join(__dirname, '..', 'db_sqlite.sqlite');
const usersFile = path.join(__dirname, '..', 'src', 'users', 'data', 'users.json');

if (!fs.existsSync(usersFile)) {
  console.error('users.json not found at', usersFile);
  process.exit(1);
}

const users = JSON.parse(fs.readFileSync(usersFile, 'utf-8'));
const db = new Database(dbPath);

// Ensure table exists (TypeORM should have created it). If not, create minimal table.
db.prepare(`CREATE TABLE IF NOT EXISTS user (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE,
  name TEXT,
  username TEXT,
  password TEXT,
  emailVerified INTEGER DEFAULT 0,
  createdAt DATETIME
)`).run();

const insert = db.prepare('INSERT OR IGNORE INTO user (email, name, username, password, emailVerified, createdAt) VALUES (?, ?, ?, ?, ?, ?)');
const update = db.prepare('UPDATE user SET name = COALESCE(?, name), username = COALESCE(?, username), emailVerified = COALESCE(?, emailVerified) WHERE email = ?');

let inserted = 0;
let updated = 0;

for (const u of users) {
  const email = u.email;
  const name = u.name || null;
  const username = u.username || null;
  const password = u.password || null;
  const emailVerified = u.emailVerified ? 1 : 0;
  const createdAt = new Date().toISOString();

  const info = insert.run(email, name, username, password, emailVerified, createdAt);
  if (info.changes) {
    inserted++;
  } else {
    update.run(name, username, emailVerified, email);
    updated++;
  }
}

console.log(`Import complete. Inserted ${inserted}, updated ${updated}`);
db.close();
