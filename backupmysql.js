const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");
const { BACKUP_ROOT, MYSQL } = require("../config.js");
const { logger } = require("../utils/logger.js");

export async function backup_mysql() {
  const results = [];

  for (const db of MYSQL.DATABASES) {
    const dbName = db.trim();
    if (!dbName) continue;

    const dbFolder = path.join(BACKUP_ROOT, dbName);
    fs.mkdirSync(dbFolder, { recursive: true });

    const dateStr = new Date().toISOString().slice(0, 10);
    const filePath = path.join(dbFolder, `${dateStr}.sql`);

    const cmd = `mysqldump -u ${MYSQL.USER} -p${MYSQL.PASSWORD} ${dbName} > ${filePath}`;

    try {
      await execPromise(cmd);
      logger.info(`MySQL backup completed: ${filePath}`);
      results.push(filePath);
    } catch (err) {
      logger.error(`MySQL backup failed for ${dbName}: ${err}`);
    }
  }

  return results;
}

function execPromise(cmd) {
  return new Promise((resolve, reject) => {
    exec(cmd, (error, stdout, stderr) => {
      if (error) reject(stderr || error.message);
      else resolve(stdout);
    });
  });
}
