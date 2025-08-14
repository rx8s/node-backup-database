const { backup_mysql } = require("./backup/backup_mysql.js");
const { backup_sqlserver } = require("./backup/backup_sqlserver.js");
const { GDRIVE, FTP, PUSH_URL } = require("./config.js");
const { logger } = require("./utils/logger.js");
const { upload_to_gdrive } = require("./upload/upload_gdrive.js");
const { upload_to_ftp } = require("./upload/upload_ftp.js");
const { notify } = require("./utils/notify.js");

const mode = process.env.MODE || "mysql,mssql"; // mysql, mssql, or both

(async () => {
  const startTime = new Date();
  let allFiles = [];

  if (mode.includes("mysql")) {
    const mysqlFiles = await backup_mysql();
    allFiles = allFiles.concat(mysqlFiles);
  }

  if (mode.includes("mssql")) {
    const mssqlFiles = await backup_sqlserver();
    allFiles = allFiles.concat(mssqlFiles);
  }

  // Upload
  if (GDRIVE.ENABLE) await upload_to_gdrive(allFiles);
  if (FTP.ENABLE) await upload_to_ftp(allFiles);

  const endTime = new Date();
  await notify({
    message: "Backup job completed successfully",
    startTime,
    endTime,
    pushUrl: PUSH_URL
  });

  logger.info("Backup job finished.");
})();
