const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");
const { BACKUP_ROOT, SQLSERVER } = require("../config.js");
const { logger } = require("../utils/logger.js");

export async function backup_sqlserver() {
  const results = [];

  for (const db of SQLSERVER.DATABASES) {
    const dbName = db.trim();
    if (!dbName) continue;

    const dbFolder = path.join(BACKUP_ROOT, dbName);
    fs.mkdirSync(dbFolder, { recursive: true });

    const dateStr = new Date().toISOString().slice(0, 10);
    const filePath = path.join(dbFolder, `${dateStr}.bak`);

    const backupType = (new Date().getDay() === 0) ? "DATABASE" : "LOG";
    const sql = `BACKUP ${backupType} [${dbName}] TO DISK = N'${path.resolve(filePath)}' WITH INIT`;

    const cmd = `sqlcmd -S ${SQLSERVER.HOST} -U ${SQLSERVER.USER} -P ${SQLSERVER.PASSWORD} -Q "${sql}"`;

    try {
      await execPromise(cmd);
      logger.info(`SQL Server backup completed: ${filePath}`);
      results.push(filePath);
    } catch (err) {
      logger.error(`SQL Server backup failed for ${dbName}: ${err}`);
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
