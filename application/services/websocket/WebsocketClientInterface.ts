import { WebsocketMessage } from "../../../domain/entities/Message";
import { WebsocketRessourceEnum } from "./WebsocketRessourceEnum";

export interface WebsocketClientInterface {
  join(ressource: WebsocketRessourceEnum, channelId: number): void;
  onMessage(action: (message: WebsocketMessage) => void, ressource: WebsocketRessourceEnum, channelId: number): void;
  emitMessage(message: WebsocketMessage, ressource: WebsocketRessourceEnum, channelId: number): void;
}

