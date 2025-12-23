import { WebsocketChannelIdentifierBuilderInterface } from "../../../application/services/websocket/WebsocketChannelIdentifierBuilderInterface";
import { WebsocketRessourceEnum } from "../../../application/services/websocket/WebsocketRessourceEnum";

export class SocketIoChannelIdentifierBuilder implements WebsocketChannelIdentifierBuilderInterface {
  build(ressource: WebsocketRessourceEnum, channelId: number): string {
    return `${ressource}:${channelId}`;
  }
}
