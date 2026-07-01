const fs = require('fs');
const path = require('path');
const dbPath = path.join(process.cwd(), 'db_sqlite.sqlite');
if (!fs.existsSync(dbPath)) {
  console.error('NO_DB');
  process.exit(1);
}
const Database = require('better-sqlite3');
const db = new Database(dbPath, { readonly: true });
const rows = db.prepare('SELECT id, email, role, password, emailVerified, isVerified FROM user').all();
console.log(JSON.stringify(rows, null, 2));
db.close();
