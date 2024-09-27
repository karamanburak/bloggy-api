const cron = require("cron");
const https = require("https");

const backendUrl = "https://bloggy-api-xa7p.onrender.com/";
const job = new cron.CronJob("*/14 * * * *", function () {
  // This function will be executed every 14 minutes
  console.log(`Restarting server on ${backendUrl}`);

  // Perform an HTTPS GET request to hit any backend api.
  https
    .get(backendUrl, (res) => {
      if (res.statusCode === 200) {
        console.log("Server restarted");
      } else {
        console.error(
          `Failed to restart server width status code: ${res.statusCode}`
        );
      }
    })
    .on("error", (err) => {
      console.error("Error during Restart:", err.message);
    });
});

// Export the cron job
module.exports = job;
