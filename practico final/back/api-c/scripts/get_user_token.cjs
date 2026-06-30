const Database = require('better-sqlite3');
const path = require('path');
const dbPath = path.join(__dirname, '..', 'db_sqlite.sqlite');
const db = new Database(dbPath);
const row = db.prepare("select id, email, verificationToken, isVerified, emailVerified from user where email=?").get('admin@mail.com');
console.log(JSON.stringify(row, null, 2));
