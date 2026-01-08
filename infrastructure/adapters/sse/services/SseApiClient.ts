import { EventSourceMessage, fetchEventSource } from "@microsoft/fetch-event-source";

import { SseApiClientInterface } from "../../../../application/services/sse/SseApiClientInterface";
import { News } from "../../../../domain/entities/News";
import { ssePaths } from "../../../../application/services/sse/ssePaths";
import { Notification } from "../../../../domain/entities/Notification";
import { SseRessourceEnum } from "../../../../application/services/sse/SseRessourceEnum";

export interface SseNewsPayloadInterface {
  data: News;
}

export interface SseNotificationPayloadInterface {
  data: Notification;
}

export class SseApiClient implements SseApiClientInterface {
  constructor(
    private readonly baseUrl: string,
    private readonly token: string,
  ) {
  }

  public async get(url: string, onMessage: (event: EventSourceMessage) => void): Promise<void> {
    fetchEventSource(`${this.baseUrl}${url}`, {
      headers: {
        Accept: "text/event-stream",
        ...(this.token ? { Authorization: `Bearer ${this.token}` } : {}),
      },
      onopen: async () => console.log("SSE connection opened."),
      onmessage: async (event) => {
        onMessage(event);
      },
      onclose: () => console.log("SSE connection closed."),
      onerror: (err: Error) => console.log(err),
    })
  }

  public watchNews(action: (news: News) => void): void {
    this.get(ssePaths.news.subscribe, (event: EventSourceMessage) => {
      const eventName = event.event;
      if (![SseRessourceEnum.NEWS].includes(eventName as SseRessourceEnum)) {
        return;
      }

      const payload = JSON.parse(event.data);
      payload.forEach((news: News) => {
        action(news);
      });
    });
  }

  public watchNotifications(action: (notification: Notification) => void): void{
    this.get(ssePaths.notification.subscribe, (event: EventSourceMessage) => {
      const eventName = event.event;
      if (![SseRessourceEnum.NOTIFICATIONS, SseRessourceEnum.PRIVATE_NOTIFICATIONS].includes(eventName as SseRessourceEnum)) {
        return;
      }

      const payload = JSON.parse(event.data);
      payload.forEach((notification: Notification) => {
        action(notification);
      });
    });
  }
}
