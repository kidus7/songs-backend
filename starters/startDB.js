
// Mongoose
const mongoose = require("mongoose");

// Configs
const configs = require("../configs");

// Connect with DB
mongoose
  .connect(process.env.REMOTE)
  .then((con) => {
    console.log(`Successfully Connected`);
  })
  .catch((err) => {
    console.log(`Error while connecting to Database`);
    console.log(err);
  });

// DB Connection
const db_conn = mongoose.connection;

// Handle error after connecting
db_conn.on("error", (err) => {
  console.log(`Error while connecting to DB`);
  console.log(err);
});

db_conn.on("disconnected", () => {
  console.log(`DB is disconnected`);
});

// Export DB Connection
module.exports = db_conn;
