import { WebsocketChannelIdentifierBuilderInterface } from "../../../application/services/websocket/WebsocketChannelIdentifierBuilderInterface";
import { WebsocketRessourceEnum } from "../../../domain/enums/WebsocketRessourceEnum";

export class SocketIoChannelIdentifierBuilder implements WebsocketChannelIdentifierBuilderInterface {
  build(ressource: WebsocketRessourceEnum, channelId: number): string {
    return `${ressource}:${channelId}`;
  }
}
