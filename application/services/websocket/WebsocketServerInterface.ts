import { WebsocketMessage } from "../../../domain/entities/Message";
import { WritingMessageUser } from "../../../domain/entities/User";
import { WebsocketRessourceEnum } from "../../../domain/enums/WebsocketRessourceEnum";

export interface WebsocketServerInterface {
  emitMessage(message: WebsocketMessage, websocketRessource: WebsocketRessourceEnum, channelId: number): void;
  emitWritingMessage(user: WritingMessageUser, websocketRessource: WebsocketRessourceEnum, channelId: number): void;
  emitStopWritingMessage(user: WritingMessageUser, websocketRessource: WebsocketRessourceEnum, channelId: number): void;
}

