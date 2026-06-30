const Database = require('better-sqlite3');
const path = require('path');
const dbPath = path.join(__dirname, '..', '..', 'back', 'api-c', 'db_sqlite.sqlite');
const db = new Database(dbPath);
const row = db.prepare("select * from user_token where type='verify' order by createdAt desc limit 1").get();
console.log(JSON.stringify(row, null, 2));
