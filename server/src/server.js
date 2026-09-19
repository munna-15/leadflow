import dns from "node:dns";
import { createServer } from "node:http";

import dotenv from "dotenv";

dns.setServers(["1.1.1.1", "8.8.8.8"]);

dotenv.config();

const { default: app } = await import("./app.js");

const { default: connectDatabase } = await import("./config/db.js");

const { initializeSocket } = await import("./realtime/socket.js");

const { startNotificationScheduler } =
  await import("./services/notification.scheduler.js");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDatabase();

    const httpServer = createServer(app);

    initializeSocket(httpServer);

    httpServer.listen(PORT, () => {
      console.log(`LeadFlow API running on port ${PORT}`);
    });

    startNotificationScheduler();
  } catch (error) {
    console.error("Server startup failed:", error);

    process.exit(1);
  }
};

startServer();
