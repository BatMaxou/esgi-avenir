import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';

import { WebsocketServerInterface } from "../../../application/services/websocket/WebsocketServerInterface";
import { WebsocketChannelIdentifierBuilderInterface } from "../../../application/services/websocket/WebsocketChannelIdentifierBuilderInterface";
import { WebsocketMessage } from "../../../domain/entities/Message";
import { TokenManagerInterface } from '../../../application/services/token/TokenManagerInterface';
import { AuthMiddlewareUsecase } from '../../../application/usecases/middlewares/AuthMiddlewareUsecase';
import { UserRepositoryInterface } from '../../../application/repositories/UserRepositoryInterface';
import { UnauthorizedError } from '../../../application/errors/middlewares/UnauthorizedError';
import { User, WritingMessageUser } from '../../../domain/entities/User';
import { WritePrivateMessageUsecase } from '../../../application/usecases/private-channel/WritePrivateMessageUsecase';
import { PrivateChannelRepositoryInterface } from '../../../application/repositories/PrivateChannelRepositoryInterface';
import { MessageRepositoryInterface } from '../../../application/repositories/MessageRepositoryInterface';
import { WriteCompanyMessageUsecase } from '../../../application/usecases/company-channel/WriteCompanyMessageUsecase';
import { CompanyChannelRepositoryInterface } from '../../../application/repositories/CompanyChannelRepositoryInterface';
import { WritingMessageUsecase } from '../../../application/usecases/writing-message/WritingMessageUsecase';
import { StopWritingMessageUsecase } from '../../../application/usecases/writing-message/StopWritingMessageUsecase';
import { WebsocketEventEnum } from '../../../domain/enums/WebsocketEventEnum';
import { WebsocketRessourceEnum } from '../../../domain/enums/WebsocketRessourceEnum';

declare module 'socket.io' {
  interface Socket {
    user?: User;
  }
}

export class SocketIoServer implements WebsocketServerInterface {
  private io: Server;

  public constructor(
    server: HttpServer,
    origin: string = '*',
    private readonly channelIdentifierBuilder: WebsocketChannelIdentifierBuilderInterface,
    private readonly tokenManager: TokenManagerInterface,
    private readonly userRepository: UserRepositoryInterface,
    private readonly privateChannelRepository: PrivateChannelRepositoryInterface,
    private readonly companyChannelRepository: CompanyChannelRepositoryInterface,
    private readonly messageRepository: MessageRepositoryInterface,
  ) {
    this.io = new Server(server, {
      cors: {
        origin,
      }
    });

    this.initAuthMiddleware();
    this.initConnection();
  }

  public emitMessage(message: WebsocketMessage, ressource: WebsocketRessourceEnum, channelId: number) {
    this.io.to(this.channelIdentifierBuilder.build(ressource, channelId)).emit(WebsocketEventEnum.MESSAGE, { ressource, message });
  }

  public emitWritingMessage(user: WritingMessageUser, ressource: WebsocketRessourceEnum, channelId: number) {
    this.io.to(this.channelIdentifierBuilder.build(ressource, channelId)).emit(WebsocketEventEnum.WRITING, { ressource, user, channelId });
  }

  public emitStopWritingMessage(user: WritingMessageUser, ressource: WebsocketRessourceEnum, channelId: number) {
    this.io.to(this.channelIdentifierBuilder.build(ressource, channelId)).emit(WebsocketEventEnum.STOP_WRITING, { ressource, user, channelId });
  }

  private initConnection() {
    this.io.on('connection', (socket) => {
      this.initJoin(socket);
      this.initMessageListener(socket);
      this.initWritingMessageListener(socket);
      this.initStopWritingMessageListener(socket);

      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
      });
    });
  }

  private initJoin(socket: Socket) {
    socket.on(WebsocketEventEnum.JOIN, (data: { ressource: WebsocketRessourceEnum, channelId: number }) => {
      if (!socket.user) {
        return;
      }

      const { ressource, channelId } = data;
      socket.join(this.channelIdentifierBuilder.build(ressource, channelId));
    });
  }
  
  private initWritingMessageListener(socket: Socket) {
    socket.on(WebsocketEventEnum.WRITING, async (data: { ressource: WebsocketRessourceEnum, channelId: number }) => {
      if (!socket.user) {
        return;
      }
      
      const { ressource, channelId } = data;
      const usecase = new WritingMessageUsecase(this);
      await usecase.execute(channelId, ressource, socket.user);
    });
  }

  private initStopWritingMessageListener(socket: Socket) {
    socket.on(WebsocketEventEnum.STOP_WRITING, async (data: { ressource: WebsocketRessourceEnum, channelId: number }) => {
      if (!socket.user) {
        return;
      }

      const { ressource, channelId } = data;
      const usecase = new StopWritingMessageUsecase(this);
      await usecase.execute(channelId, ressource, socket.user);
    });
  }
  
  private initMessageListener(socket: Socket) {
    socket.on(WebsocketEventEnum.MESSAGE, async (data: { message: WebsocketMessage, ressource: WebsocketRessourceEnum }) => {
      if (!socket.user) {
        return;
      }

      const { message, ressource } = data;

      if (ressource == WebsocketRessourceEnum.PRIVATE_MESSAGE) {
        const usecase = new WritePrivateMessageUsecase(this.privateChannelRepository, this.messageRepository, this) 
        await usecase.execute(message.content, message.channel.id, socket.user);
      }

      if (ressource == WebsocketRessourceEnum.COMPANY_MESSAGE) {
        const usecase = new WriteCompanyMessageUsecase(this.companyChannelRepository, this.messageRepository, this) 
        await usecase.execute(message.content, message.channel.id, socket.user);
      }
    });
  }

  private initAuthMiddleware() {
    this.io.use(async (socket, next) => {
      const token = socket.handshake.auth.token;
      const usecase = new AuthMiddlewareUsecase(this.userRepository, this.tokenManager);
      const maybeUser = await usecase.execute(token);
      if (maybeUser instanceof UnauthorizedError) {
        socket.disconnect();
        next(maybeUser);

        return;
      }

      socket.user = maybeUser;
      next();
    });
  }
}
