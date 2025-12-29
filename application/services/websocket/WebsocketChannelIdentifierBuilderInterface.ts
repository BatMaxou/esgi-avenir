import { WebsocketRessourceEnum } from "./WebsocketRessourceEnum";

export interface WebsocketChannelIdentifierBuilderInterface {
  build(ressource: WebsocketRessourceEnum, channelId: number): string;
}

