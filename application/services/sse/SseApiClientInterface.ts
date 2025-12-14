import { News } from "../../../domain/entities/News";
import { Notification } from "../../../domain/entities/Notification";

export interface SseApiClientInterface {
  watchNews(action: (news: News) => void): void;
  watchNotifications(action: (notification: Notification) => void): void;
}

