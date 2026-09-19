import { io, type Socket } from "socket.io-client";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const getSocketUrl = () => {
  try {
    return new URL(API_URL).origin;
  } catch {
    return "http://localhost:5000";
  }
};

const SOCKET_URL = getSocketUrl();

let socket: Socket | null = null;

export const getSocket = (): Socket => {
  if (socket) {
    return socket;
  }

  socket = io(SOCKET_URL, {
    withCredentials: true,
    autoConnect: false,
    transports: ["websocket", "polling"],
  });

  return socket;
};

export const connectSocket = (): Socket => {
  const currentSocket = getSocket();

  if (!currentSocket.connected) {
    currentSocket.connect();
  }

  return currentSocket;
};

export const disconnectSocket = (): void => {
  if (!socket) {
    return;
  }

  if (socket.connected) {
    socket.disconnect();
  }
};

export const getSocketState = (): boolean => {
  return socket?.connected ?? false;
};
