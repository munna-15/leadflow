import { Server } from "socket.io";

import User from "../models/user.model.js";
import { verifyToken } from "../utils/jwt.js";

let io = null;

const getCookieValue = (cookieHeader, cookieName) => {
  if (!cookieHeader) {
    return null;
  }

  const cookies = cookieHeader.split(";").map((part) => part.trim());

  for (const cookie of cookies) {
    const separatorIndex = cookie.indexOf("=");

    if (separatorIndex === -1) {
      continue;
    }

    const name = cookie.slice(0, separatorIndex).trim();

    if (name !== cookieName) {
      continue;
    }

    return decodeURIComponent(cookie.slice(separatorIndex + 1));
  }

  return null;
};

const getUserRoom = (businessId, userId) => {
  return `user:${businessId}:${userId}`;
};

const validateSocketUser = async (token) => {
  const decoded = verifyToken(token);

  if (!decoded.userId || !decoded.businessId || !decoded.role) {
    throw new Error("Invalid authentication");
  }

  if (!Number.isInteger(decoded.tokenVersion)) {
    throw new Error("Invalid authentication");
  }

  const user = await User.findOne({
    _id: decoded.userId,
    businessId: decoded.businessId,
    isActive: true,
  })
    .select("role tokenVersion")
    .lean();

  if (!user) {
    throw new Error("Authentication is no longer valid");
  }

  if (
    user.role !== decoded.role ||
    user.tokenVersion !== decoded.tokenVersion
  ) {
    throw new Error("Authentication is no longer valid");
  }

  return {
    userId: decoded.userId,
    businessId: decoded.businessId,
    role: decoded.role,
  };
};

export const initializeSocket = (httpServer) => {
  if (io) {
    return io;
  }

  io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL,
      credentials: true,
    },
  });

  io.use(async (socket, next) => {
    try {
      const cookieName = process.env.COOKIE_NAME || "leadflow_token";

      const cookieHeader = socket.handshake.headers.cookie;

      const token = getCookieValue(cookieHeader, cookieName);

      if (!token) {
        return next(new Error("Authentication required"));
      }

      const user = await validateSocketUser(token);

      socket.user = user;

      return next();
    } catch (error) {
      console.error("Socket authentication failed:", error);

      return next(new Error("Authentication failed"));
    }
  });

  io.on("connection", (socket) => {
    const { businessId, userId } = socket.user;

    const userRoom = getUserRoom(businessId, userId);

    socket.join(userRoom);

    console.log(`Socket connected: ${userId}`);

    socket.on("disconnect", (reason) => {
      console.log(`Socket disconnected: ${userId} (${reason})`);
    });
  });

  console.log("Socket.IO initialized");

  return io;
};

export const emitNotification = (notification) => {
  if (!io || !notification) {
    return;
  }

  try {
    const { businessId, recipientId } = notification;

    if (!businessId || !recipientId) {
      return;
    }

    const room = getUserRoom(businessId, recipientId);

    io.to(room).emit("notification:new", notification);
  } catch (error) {
    console.error("Failed to emit realtime notification:", error);
  }
};

export const getIO = () => {
  return io;
};
