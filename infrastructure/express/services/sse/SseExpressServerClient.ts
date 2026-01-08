import { Request, Response } from "express";

import { AbstractSseServerClient } from "../../../adapters/sse/services/AbstractSseServerClient";

export class SseExpressServerClient extends AbstractSseServerClient<Request, Response> {}
