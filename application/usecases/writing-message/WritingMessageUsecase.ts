import { User } from '../../../domain/entities/User';
import { WebsocketRessourceEnum } from '../../../domain/enums/WebsocketRessourceEnum';
import { WebsocketServerInterface } from '../../services/websocket/WebsocketServerInterface';

export class WritingMessageUsecase {
  public constructor(
    private readonly websocketServer: WebsocketServerInterface,
  ) {}

  public async execute(
    channelId: number,
    ressource: WebsocketRessourceEnum,
    author: User,
  ): Promise<void> {
    this.websocketServer.emitWritingMessage({
      id: author.id,
      firstName: author.firstName,
      lastName: author.lastName,
    }, ressource, channelId);
  }
}

