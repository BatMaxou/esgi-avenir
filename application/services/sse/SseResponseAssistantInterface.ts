export interface SseResponseAssistantInterface<SseRequest, SseResponse> {
  prepare: (response: SseResponse) => SseResponse;
  remove: (request: SseRequest, callback: () => void) => void;
  write: (response: SseResponse, data: string[]) => void;
}

