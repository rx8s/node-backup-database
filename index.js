const backupmysql = require("./backupmysql.js");
const backupmssql = require("./backupmssql.js");
const config = require("./config.js");
const gdrive = require("./middlewares/gdrive.js");
const ftp = require("./middlewares/ftp.js");
const logs = require("./utils/logger.js");
const noty = require("./utils/noty.js");

//const mode = process.env.MODE || "mysql,mssql"; // mysql, mssql, or both
//const mode = process.env.MODE || "mysql,mssql"; // mysql, mssql, or both
const mode = process.env.MODE || "mysql"; // mysql, mssql, or both

(async () => {
  const startTime = new Date();
  let allFiles = [];

  if (mode.includes("mysql")) {
    const mysqlFiles = await backupmysql.backupmysql();
    allFiles = allFiles.concat(mysqlFiles);
  }

  if (mode.includes("mssql")) {
    const mssqlFiles = await backupmssql.backupmssql();
    allFiles = allFiles.concat(mssqlFiles);
  }

  // Upload
  if (config.GDRIVE.ENABLE) await gdrive.upload_to_gdrive(allFiles);
  if (config.FTP.ENABLE) await ftp.upload_to_ftp(allFiles);

  const endTime = new Date();
  await noty.notify({
    message: "Backup job completed successfully",
    startTime,
    endTime,
    pushUrl: config.PUSH_URL
  });

  logs.logger.info("Backup job finished.");
})();
