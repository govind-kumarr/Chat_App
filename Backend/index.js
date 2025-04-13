const { createServer } = require("http");
const gracefulShutdown = require("http-graceful-shutdown");
const { Server } = require("socket.io");
const app = require("./app");
require("dotenv").config();

const { connectToDb } = require("./db/db");
const { corsOptions, loadEnv } = require("./config");
const { initializeSocket, attachMiddlewares } = require("./socket");
const aws = require("./aws");
const { changeStatus } = require("./services/user.services");
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

const closeConnections = async () => {
  try {
    const sockets = await io?.fetchSockets();
    const promises = sockets?.map((socket) => {
      const user = socket?.locals?.user;
      const userId = user?.id;
      socket?.disconnect(true);
      return userId ? changeStatus(userId, false, "") : Promise.resolve();
    });
    await Promise.allSettled(promises);
    console.log("Closed all socket connections.");
  } catch (error) {
    console.error(`Error closing connections: ${error?.message}`);
  }
};

const configureAws = async () => {
  await aws.setupBucket();
  await aws.setupDir(config.userDir);
  await aws.setupDir(config.chatDir);
};

function shutdownFunction(signal) {
  return new Promise((resolve) => {
    console.log("... called signal: " + signal);
    console.log("... in cleanup");
    closeConnections().then((res) => {
      resolve();
    });
  });
}

const startServer = async () => {
  try {
    await connectToDb();
    await configureAws();
    server.listen(port, () => {
      console.log(`Server listening on Port ${port}`);
    });
    gracefulShutdown(server, {
      signals: "SIGINT SIGTERM",
      timeout: 10000,
      development: true,
      forceExit: false,
      onShutdown: shutdownFunction,
    });
  } catch (error) {
    console.log(error);
  }
};

// process.on("SIGINT", () => handleShutdown("SIGINT"));
// process.on("SIGTERM", () => handleShutdown("SIGTERM"));

startServer();
