const fs = require("fs");
const { google } = require("googleapis");
const { logger } = require("../utils/logger.js");

const SCOPES = ["https://www.googleapis.com/auth/drive.file"];
const TOKEN_PATH = "token.json";
const CREDENTIALS_PATH = "credentials.json";

function authorize() {
  const content = fs.readFileSync(CREDENTIALS_PATH, "utf8");
  const credentials = JSON.parse(content);
  const { client_secret, client_id, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

  if (fs.existsSync(TOKEN_PATH)) {
    oAuth2Client.setCredentials(JSON.parse(fs.readFileSync(TOKEN_PATH, "utf8")));
  } else {
    throw new Error("Token not found. Please authorize the app first.");
  }
  return oAuth2Client;
}

export async function upload_to_gdrive(files) {
  if (!files || files.length === 0) return;
  const auth = authorize();
  const drive = google.drive({ version: "v3", auth });

  for (const filePath of files) {
    try {
      const fileMetadata = { name: filePath.split("/").pop() };
      const media = { body: fs.createReadStream(filePath) };
      await drive.files.create({ resource: fileMetadata, media, fields: "id" });
      logger.info(`Uploaded to GDrive: ${filePath}`);
    } catch (err) {
      logger.error(`Failed to upload to GDrive: ${filePath} - ${err.message}`);
    }
  }
}
