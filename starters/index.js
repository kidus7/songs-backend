// File used to start the server or ignite the server

// Http
const http = require("http");

// App
const app = require("./app");

// DB Connection
const db_conn = require("./startDB");

// Igniter function
module.exports = () => {
  // Server
  const server = http.createServer(app);

  // Port
  const port = process.env.PORT || 4000;

  // Listen
  server.listen(port, () => {
    console.log(`Listening on ${port}...`);
  });
  // Majestic Close
  process.on("SIGINT", () => {
    server.close(() => {
      console.log(`App is closing`);
    });
    db_conn.close(() => {
      console.log(`DB is closing`);
    });
  });
};
