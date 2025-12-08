import { Request, Response } from "express";

import { NotificationRepositoryInterface } from "../../../application/repositories/NotificationRepositoryInterface";
import { InvalidCreateNotificationCommandError } from "../../../application/errors/commands/notification/InvalidCreateNotificationCommandError";
import { GetNotificationListUsecase } from "../../../application/usecases/notification/GetNotificationListUsecase";
import { CreateNotificationUsecase } from "../../../application/usecases/notification/CreateNotificationUsecase";
import { CreateNotificationCommand } from "../../../application/commands/notification/CreateNotificationCommand";
import { SseExpressServerClient } from "../services/sse/SseExpressServerClient";
import { SubscribeNotificationUsecase } from "../../../application/usecases/notification/SubscribeNotificationUsecase";

export class NotificationController {
  public constructor(
    private readonly notificationRepository: NotificationRepositoryInterface,
    private readonly sseServerClient: SseExpressServerClient,
  ) {}

  public async create(request: Request, response: Response) {
    const maybeCommand = CreateNotificationCommand.from(request.body);
    if (maybeCommand instanceof InvalidCreateNotificationCommandError) {
      return response.status(400).json({
        error: maybeCommand.message,
      });
    }

    const advisor = request.user;
    if (!advisor) {
      return response.status(401).json({
        error: "Unauthorized",
      });
    }

    const createUsecase = new CreateNotificationUsecase(
      this.notificationRepository,
      this.sseServerClient,
    );
    const maybeNotification = await createUsecase.execute(
      maybeCommand.content,
      advisor,
      maybeCommand.userId,
    );

    if (maybeNotification instanceof Error) {
      return response.status(400).json({
        error: maybeNotification.message,
      });
    }

    response.status(201).json({
      id: maybeNotification.id,
      content: maybeNotification.content,
    });
  }

  public async list(request: Request, response: Response) {
    const user = request.user;
    if (!user) {
      return response.status(401).json({
        error: "Unauthorized",
      });
    }

    const getListUsecase = new GetNotificationListUsecase(this.notificationRepository);
    const notifications = await getListUsecase.execute(user);

    response.status(200).json(notifications.map((notification) => ({
      id: notification.id,
      content: notification.content,
      createdAt: notification.createdAt,
    })));
  }

  public subscribe(request: Request, response: Response) {
    const user = request.user;
    if (!user || !user.id) {
      return response.status(401).json({
        error: "Unauthorized",
      });
    }

    const subscribeUsecase = new SubscribeNotificationUsecase(this.sseServerClient);
    subscribeUsecase.execute(request, response, user);
  }
}
