import { WebsocketRessourceEnum } from "../../../domain/enums/WebsocketRessourceEnum";

export interface WebsocketChannelIdentifierBuilderInterface {
  build(ressource: WebsocketRessourceEnum, channelId: number): string;
}

