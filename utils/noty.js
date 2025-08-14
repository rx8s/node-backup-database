const axios = require("axios");
const logs = require("./logger.js");

exports.notify = async ({ message, startTime, endTime, pushUrl }) => {
  if (!pushUrl) return;
  try {
    await axios.post(pushUrl, {
      message,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
    });
    logs.logger.info("Notification sent successfully");
  } catch (err) {
    logs.logger.error(`Notification failed: ${err.message}`);
  }
}
