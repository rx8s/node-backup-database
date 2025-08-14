const axios = require("axios");
const { logger } = require("./logger.js");

export async function notify({ message, startTime, endTime, pushUrl }) {
  if (!pushUrl) return;
  try {
    await axios.post(pushUrl, {
      message,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
    });
    logger.info("Notification sent successfully");
  } catch (err) {
    logger.error(`Notification failed: ${err.message}`);
  }
}
