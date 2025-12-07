import { Request, Response } from "express";

import { SseResponseAssistantInterface } from "../../../../application/services/sse/SseResponseAssistantInterface";

export class SseExpressResponseAssistant implements SseResponseAssistantInterface<Request, Response> {
  prepare(response: Response): Response {
    response.writeHead(200, {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "text/event-stream",
      "Connection": "keep-alive",
      "Cache-Control": "no-cache"
    });

    return response;
  }

  remove(request: Request, callback: () => void): void {
    request.on("close", callback);
  }

  write(response: Response, data: string[]): void {
    data.forEach((item) => {
      response.write(item);
    });
  }
}
