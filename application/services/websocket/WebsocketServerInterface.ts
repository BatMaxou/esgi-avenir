import { WebsocketMessage } from "../../../domain/entities/Message";
import { WebsocketRessourceEnum } from "./WebsocketRessourceEnum";

export interface WebsocketServerInterface {
  emitMessage(message: WebsocketMessage, websocketRessource: WebsocketRessourceEnum, channelId: number): void;
  initConnection(): void
}

