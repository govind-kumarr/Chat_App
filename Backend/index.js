const { createServer } = require("http");
const { Server } = require("socket.io");
const app = require("./app");
require("dotenv").config();

const { connectToDb } = require("./db/db");
const { corsOptions, loadEnv } = require("./config");
const { initializeSocket, attachMiddlewares } = require("./socket");
const aws = require("./aws");
const port = process.env.PORT || 3030;
const config = loadEnv();

const server = createServer(app);
const io = new Server(server, {
  cors: corsOptions,
  pingInterval: 5000,
  pingTimeout: 10000,
});

attachMiddlewares(io);
initializeSocket(io);

const closeConnections = async (io) => {
  try {
    const sockets = await io.fetchSockets();
    sockets?.map((socket) => socket?.disconnect(true));
  } catch (error) {
    console.error(`Error closing connections: ${error?.message}`);
  }
};
const shutdownServer = async () => {
  closeConnections();
};

const configureAws = async () => {
  await aws.setupBucket();
  await aws.setupDir(config.userDir);
  await aws.setupDir(config.chatDir);
};

const startServer = async () => {
  try {
    await connectToDb();
    await configureAws();
    server.listen(port, () => {
      console.log(`Server listening on Port ${port}`);
    });
  } catch (error) {
    console.log(error);
  }
};

process.on("SIGINT", () => {
  console.log("Manual shutdown: SIGINT (Ctrl+C)");
  shutdownServer();
  process.exit(0);
});

process.on("SIGTERM", () => {
  console.log("Manual shutdown: SIGTERM");
  shutdownServer();
  process.exit(0);
});

startServer();
