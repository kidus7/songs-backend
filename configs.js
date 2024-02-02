
// Dotenv
const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });

// Export config variables
module.exports = {
  db: {
    local: process.env.LOCAL,
    remote: process.env.REMOTE,
  }
};
