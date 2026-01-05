import io from "socket.io-client";
import { Socket } from "socket.io-client";

import { WebsocketClientInterface } from "../../../application/services/websocket/WebsocketClientInterface";
import { WebsocketMessage } from "../../../domain/entities/Message";
import { WritingMessageUser } from "../../../domain/entities/User";
import { WebsocketEventEnum } from "../../../domain/enums/WebsocketEventEnum";
import { WebsocketRessourceEnum } from "../../../domain/enums/WebsocketRessourceEnum";

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

    this.socket.emit(WebsocketEventEnum.JOIN, {
      ressource,
      channelId,
    });
  }

  onMessage(action: (message: WebsocketMessage) => void, targetRessource: WebsocketRessourceEnum, channelId: number) {
    if (!this.socket) {
      return;
    }

    this.socket.on(WebsocketEventEnum.MESSAGE, ({ ressource, message }: {
      ressource: WebsocketRessourceEnum,
      message: WebsocketMessage,
    }) => {
      if (
        message.channel?.id === channelId
        && ressource === targetRessource
      ) {
        action(message);
      }
    });
  }

  emitMessage(message: WebsocketMessage, ressource: WebsocketRessourceEnum) {
    if (!this.socket) {
      return;
    }

    this.socket.emit(WebsocketEventEnum.MESSAGE, {
      ressource,
      message
    });
  }

  onWritingMessage(action: (user: WritingMessageUser) => void, targetRessource: WebsocketRessourceEnum, targetChannelId: number) {
    if (!this.socket) {
      return;
    }

    this.socket.on(WebsocketEventEnum.WRITING, ({ ressource, user, channelId }: {
      ressource: WebsocketRessourceEnum,
      user: WritingMessageUser,
      channelId: number,
    }) => {
      if (
        user
        && channelId === targetChannelId
        && ressource === targetRessource
      ) {
        action(user);
      }
    });
  }

  emitWritingMessage(channelId: number, ressource: WebsocketRessourceEnum) {
    if (!this.socket) {
      return;
    }

    this.socket.emit(WebsocketEventEnum.WRITING, { ressource, channelId });
  }

  onStopWritingMessage(action: (user: WritingMessageUser) => void, targetRessource: WebsocketRessourceEnum, targetChannelId: number) {
    if (!this.socket) {
      return;
    }

    this.socket.on(WebsocketEventEnum.STOP_WRITING, ({ ressource, user, channelId }: {
      ressource: WebsocketRessourceEnum,
      user: WritingMessageUser,
      channelId: number,
    }) => {
      if (
        user
        && channelId === targetChannelId
        && ressource === targetRessource
      ) {
        action(user);
      }
    });
  }

  emitStopWritingMessage(channelId: number, ressource: WebsocketRessourceEnum) {
    if (!this.socket) {
      return;
    }

    this.socket.emit(WebsocketEventEnum.STOP_WRITING, { ressource, channelId });
  }
}

