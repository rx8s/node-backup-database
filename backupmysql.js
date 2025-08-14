const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");
const config = require("./config.js");
const logs = require("./utils/logger.js");

exports.backup_mysql = async () => {
  const results = [];

  for (const db of config.MYSQL.DATABASES) {
    const dbName = db.trim();
    if (!dbName) continue;

    const dbFolder = path.join(`${config.BACKUP_ROOT}/mysql`, dbName);
    fs.mkdirSync(dbFolder, { recursive: true });

    const dateStr = new Date().toISOString().slice(0, 10);
    const filePath = path.join(dbFolder, `${dateStr}.sql`);

    const cmd = `mysqldump -u ${config.MYSQL.USER} -p${config.MYSQL.PASSWORD} ${dbName} > ${filePath}`;

    try {
      await execPromise(cmd);
      logs.logger.info(`MySQL backup completed: ${filePath}`);
      results.push(filePath);
    } catch (err) {
      logs.logger.error(`MySQL backup failed for ${dbName}: ${err}`);
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
