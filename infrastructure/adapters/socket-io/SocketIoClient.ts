import io from "socket.io-client";
import { Socket } from "socket.io-client";

import { WebsocketClientInterface } from "../../../application/services/websocket/WebsocketClientInterface";
import { WebsocketMessage } from "../../../domain/entities/Message";
import { WebsocketRessourceEnum } from "../../../application/services/websocket/WebsocketRessourceEnum";

export class SocketIoClient implements WebsocketClientInterface {
  socket: typeof Socket | null = null;

  constructor(
    apiUrl: string,
    token: string,
  ) {
    if (!token) {
      return;
    }

    this.socket = io(apiUrl, {
      auth: {
        token: `Bearer ${token}`
      },
    });

    this.connect();
  }

  connect() {
    if (!this.socket) {
      return;
    }

    this.socket.on("connect", () => {
      console.log("✅ WS Connected");
    });
  }

  join(ressource: WebsocketRessourceEnum, channelId: number) {
    if (!this.socket) {
      return;
    }

    this.socket.emit(WebsocketRessourceEnum.JOIN, {
      ressource,
      channelId,
    });
  }

  onMessage(action: (message: WebsocketMessage) => void, ressource: WebsocketRessourceEnum, channelId: number) {
    if (!this.socket) {
      return;
    }

    this.socket.on(ressource, (message: WebsocketMessage) => {
      if (message.channel?.id === channelId) {
        action(message);
      }
    });
  }

  emitMessage(message: WebsocketMessage, ressource: WebsocketRessourceEnum) {
    if (!this.socket) {
      return;
    }

    this.socket.emit(ressource, message);
  }
}

