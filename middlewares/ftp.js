const fs = require("fs");
const ftp = require("basic-ftp");
const FTP = require("../config.js");
const logs = require("../utils/logger.js");


exports.upload_to_ftp = async (files) => {
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
      logs.logger.info(`Uploaded to FTP: ${filePath}`);
    }
  } catch (err) {
    logs.logger.error(`FTP upload failed: ${err.message}`);
  } finally {
    client.close();
  }
}
