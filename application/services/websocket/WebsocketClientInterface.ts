import { WebsocketMessage } from "../../../domain/entities/Message";
import { WritingMessageUser } from "../../../domain/entities/User";
import { WebsocketRessourceEnum } from "../../../domain/enums/WebsocketRessourceEnum";

export interface WebsocketClientInterface {
  join(ressource: WebsocketRessourceEnum, channelId: number): void;
  onMessage(action: (message: WebsocketMessage) => void, ressource: WebsocketRessourceEnum, channelId: number): void;
  emitMessage(message: WebsocketMessage, ressource: WebsocketRessourceEnum): void;
  onWritingMessage(action: (user: WritingMessageUser) => void, ressource: WebsocketRessourceEnum, channelId: number): void;
  emitWritingMessage(channelId: number, ressource: WebsocketRessourceEnum): void;
  onStopWritingMessage(action: (user: WritingMessageUser) => void, ressource: WebsocketRessourceEnum, channelId: number): void;
  emitStopWritingMessage(channelId: number, ressource: WebsocketRessourceEnum): void;
}

