const fs = require("fs");
const ftp = require("basic-ftp");
const { FTP } = require("../config.js");
const { logger } = require("../utils/logger.js");

export async function upload_to_ftp(files) {
  if (!files || files.length === 0) return;
  const client = new ftp.Client();
  client.ftp.verbose = true;

  try {
    await client.access({
      host: FTP.HOST,
      user: FTP.USER,
      password: FTP.PASSWORD,
      secure: false
    });

    for (const filePath of files) {
      const remotePath = `${FTP.REMOTE_PATH}/${filePath.split("/").pop()}`;
      await client.uploadFrom(filePath, remotePath);
      logger.info(`Uploaded to FTP: ${filePath}`);
    }
  } catch (err) {
    logger.error(`FTP upload failed: ${err.message}`);
  } finally {
    client.close();
  }
}
