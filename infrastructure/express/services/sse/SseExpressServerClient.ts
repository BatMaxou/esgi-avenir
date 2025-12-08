import { Request, Response } from "express";

import { AbstractSseServerClient } from "../../../adapters/sse/AbstractSseServerClient";

export class SseExpressServerClient extends AbstractSseServerClient<Request, Response> {}
