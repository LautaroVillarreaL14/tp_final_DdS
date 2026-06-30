const Database = require('better-sqlite3');
const path = require('path');
const dbPath = path.join(__dirname, '..', 'db_sqlite.sqlite');
const db = new Database(dbPath, { readonly: true });
try {
  const r = db.prepare("SELECT id,email FROM user WHERE email LIKE 'e2e%" + "' ORDER BY id DESC LIMIT 1").get();
  if (!r) { console.log('NO_E2E_USER'); process.exit(0); }
  console.log(JSON.stringify(r));
} catch (e) {
  console.error('ERROR', e.message);
  process.exit(2);
} finally { db.close(); }
