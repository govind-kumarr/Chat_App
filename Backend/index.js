const { createServer } = require("http");
const { Server } = require("socket.io");
const app = require("./app");
require("dotenv").config();

const { connectToDb } = require("./db/db");
const { corsOptions } = require("./config");
const { initializeSocket, attachMiddlewares } = require("./socket");
const port = process.env.PORT || 3030;

const server = createServer(app);
const io = new Server(server, {
  cors: corsOptions,
  pingInterval: 5000,
  pingTimeout: 10000,
});

attachMiddlewares(io);
initializeSocket(io);

const startServer = () =>
  server.listen(port, () => {
    console.log(`Server listening on Port ${port}`);
  });

connectToDb(startServer);
