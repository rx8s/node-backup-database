const dotenv = require("dotenv")
dotenv.config();

const BACKUP_ROOT = process.env.BACKUP_ROOT || "/var/backup";
const KEEP_DAYS = parseInt(process.env.KEEP_DAYS || "7", 10);

const MYSQL = {
  USER: process.env.MYSQL_USER,
  PASSWORD: process.env.MYSQL_PASSWORD,
  DATABASES: process.env.MYSQL_DATABASES ? process.env.MYSQL_DATABASES.split(",") : [],
};

const SQLSERVER = {
  HOST: process.env.SQLSERVER_HOST,
  USER: process.env.SQLSERVER_USER,
  PASSWORD: process.env.SQLSERVER_PASSWORD,
  DATABASES: process.env.SQLSERVER_DATABASES ? process.env.SQLSERVER_DATABASES.split(",") : [],
};

const PUSH_URL = process.env.PUSH_URL;

const FTP = {
  ENABLE: (process.env.ENABLE_FTP || "true").toLowerCase() === "true",
  HOST: process.env.FTP_HOST,
  USER: process.env.FTP_USER,
  PASSWORD: process.env.FTP_PASSWORD,
  REMOTE_PATH: process.env.FTP_REMOTE_PATH || "/",
};

const GDRIVE = {
  ENABLE: (process.env.ENABLE_GDRIVE || "true").toLowerCase() === "true",
};


module.exports = {
  BACKUP_ROOT,
  KEEP_DAYS,
  MYSQL,
  SQLSERVER,
  PUSH_URL,
  FTP,
  GDRIVE
};