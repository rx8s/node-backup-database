const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");
const config = require("./config.js");
const logs = require("./utils/logger.js");

exports.backupmssql = async () => {
  const results = [];

  for (const db of config.SQLSERVER.DATABASES) {
    const dbName = db.trim();
    if (!dbName) continue;

    const dbFolder = path.join(`${config.BACKUP_ROOT}/mssql`, dbName);
    fs.mkdirSync(dbFolder, { recursive: true });

    const dateStr = new Date().toISOString().slice(0, 10);
    const filePath = path.join(dbFolder, `${dateStr}.bak`);

    const backupType = (new Date().getDay() === 0) ? "DATABASE" : "LOG";
    const sql = `BACKUP ${backupType} [${dbName}] TO DISK = N'${path.resolve(filePath)}' WITH INIT`;

    const cmd = `sqlcmd -S ${config.SQLSERVER.HOST} -U ${config.SQLSERVER.USER} -P ${config.SQLSERVER.PASSWORD} -Q "${sql}"`;

    try {
      await execPromise(cmd);
      logs.logger.info(`SQL Server backup completed: ${filePath}`);
      results.push(filePath);
    } catch (err) {
      logs.logger.error(`SQL Server backup failed for ${dbName}: ${err}`);
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
