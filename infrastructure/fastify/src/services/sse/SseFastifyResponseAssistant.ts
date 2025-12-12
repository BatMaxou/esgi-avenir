import { FastifyRequest, FastifyReply } from "fastify";

import { SseResponseAssistantInterface } from "../../../../../application/services/sse/SseResponseAssistantInterface";

export class SseFastifyResponseAssistant implements SseResponseAssistantInterface<FastifyRequest, FastifyReply> {
  prepare(response: FastifyReply): FastifyReply {
    response.raw.writeHead(200, {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    });

    return response;
  }

  remove(request: FastifyRequest, callback: () => void): void {
    request.raw.on("close", () => {
      callback();
    });
  }

  write(response: FastifyReply, data: string[]): void {
    data.forEach((item) => {
      response.raw.write(item);
    });
  }
}
