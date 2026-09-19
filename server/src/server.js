
import dns from "node:dns";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createServer } from "node:http";

import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.resolve(__dirname, "../.env"),
});

dns.setServers(["1.1.1.1", "8.8.8.8"]);

const { default: app } = await import("./app.js");
const { default: connectDatabase } = await import("./config/db.js");
const { initializeSocket } = await import("./realtime/socket.js");
const { startNotificationScheduler } =
  await import("./services/notification.scheduler.js");

const PORT = Number(process.env.PORT) || 5000;
const HOST = "0.0.0.0";

const startServer = async () => {
  try {
    if (!process.env.PLATFORM_OWNER_EMAIL) {
      console.warn(
        "Warning: PLATFORM_OWNER_EMAIL is not configured.",
      );
    }

    await connectDatabase();

    const httpServer = createServer(app);

    initializeSocket(httpServer);

    httpServer.listen(PORT, HOST, () => {
      console.log(
        `LeadFlow API running on http://${HOST}:${PORT}`,
      );
    });

    startNotificationScheduler();
  } catch (error) {
    console.error("Server startup failed:", error);
    process.exit(1);
  }
};

startServer();

