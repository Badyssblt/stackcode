import "nitropack";
import type { Server as SocketIOServer } from "socket.io";

declare module "nitropack" {
  interface NitroApp {
    $io: SocketIOServer;
  }
}

declare module "h3" {
  interface H3EventContext {
    io: SocketIOServer;
  }
}
