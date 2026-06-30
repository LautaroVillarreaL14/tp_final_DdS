const Database = require('better-sqlite3');
const path = require('path');
const email = process.argv[2];
if (!email) { console.error('Usage: node get_token.js <email>'); process.exit(2); }
const dbPath = path.join(__dirname, '..', 'db_sqlite.sqlite');
const db = new Database(dbPath, { readonly: true });
try {
  const user = db.prepare('SELECT id,email FROM user WHERE email = ?').get(email);
  if (!user) { console.error('USER_NOT_FOUND'); process.exit(3); }
  const tokenRow = db.prepare('SELECT token,type,expiresAt FROM user_token WHERE userId = ? ORDER BY id DESC LIMIT 1').get(user.id);
  if (!tokenRow) { console.error('TOKEN_NOT_FOUND'); process.exit(4); }
  console.log(JSON.stringify({ email: user.email, userId: user.id, token: tokenRow.token, type: tokenRow.type, expiresAt: tokenRow.expiresAt }));
} catch (e) {
  console.error('ERROR', e.message);
  process.exit(5);
} finally {
  db.close();
}
