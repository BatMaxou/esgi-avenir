import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';

import { WebsocketServerInterface } from "../../../application/services/websocket/WebsocketServerInterface";
import { WebsocketRessourceEnum } from "../../../application/services/websocket/WebsocketRessourceEnum";
import { WebsocketChannelIdentifierBuilderInterface } from "../../../application/services/websocket/WebsocketChannelIdentifierBuilderInterface";
import { WebsocketMessage } from "../../../domain/entities/Message";
import { TokenManagerInterface } from '../../../application/services/token/TokenManagerInterface';
import { AuthMiddlewareUsecase } from '../../../application/usecases/middlewares/AuthMiddlewareUsecase';
import { UserRepositoryInterface } from '../../../application/repositories/UserRepositoryInterface';
import { UnauthorizedError } from '../../../application/errors/middlewares/UnauthorizedError';
import { User } from '../../../domain/entities/User';
import { WritePrivateMessageUsecase } from '../../../application/usecases/private-channel/WritePrivateMessageUsecase';
import { PrivateChannelRepositoryInterface } from '../../../application/repositories/PrivateChannelRepositoryInterface';
import { MessageRepositoryInterface } from '../../../application/repositories/MessageRepositoryInterface';
import { WriteCompanyMessageUsecase } from '../../../application/usecases/company-channel/WriteCompanyMessageUsecase';
import { CompanyChannelRepositoryInterface } from '../../../application/repositories/CompanyChannelRepositoryInterface';

declare module 'socket.io' {
  interface Socket {
    user?: User;
  }
}

export class SocketIoServer implements WebsocketServerInterface {
  private io: Server;

  public constructor(
    server: HttpServer,
    private readonly origin: string = '*',
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

  public emitMessage(message: WebsocketMessage, websocketRessource: WebsocketRessourceEnum, channelId: number) {
    this.io.to(this.channelIdentifierBuilder.build(websocketRessource, channelId)).emit(websocketRessource, message);
  }

  public initConnection() {
    this.io.on('connection', (socket) => {
      this.initJoin(socket);
      this.initPrivateChannelListener(socket);
      this.initCompanyChannelListener(socket);

      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
      });
    });
  }

  private initJoin(socket: Socket) {
    socket.on(WebsocketRessourceEnum.JOIN, (data) => {
      const { ressource, channelId } = data;
      socket.join(this.channelIdentifierBuilder.build(ressource, channelId));
    });
  }
  
  private initPrivateChannelListener(socket: Socket) {
    socket.on(WebsocketRessourceEnum.PRIVATE_MESSAGE, async (message: WebsocketMessage) => {
      if (!socket.user) {
        return;
      }

      const usecase = new WritePrivateMessageUsecase(this.privateChannelRepository, this.messageRepository, this) 
      await usecase.execute(message.content, message.channel.id, socket.user);
    });
  }

  private initCompanyChannelListener(socket: Socket) {
    socket.on(WebsocketRessourceEnum.COMPANY_MESSAGE, async (message: WebsocketMessage) => {
      if (!socket.user) {
        return;
      }

      const usecase = new WriteCompanyMessageUsecase(this.companyChannelRepository, this.messageRepository, this) 
      await usecase.execute(message.content, message.channel.id, socket.user);
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
