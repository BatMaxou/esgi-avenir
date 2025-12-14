import { FastifyReply, FastifyRequest } from "fastify";

import { AbstractSseServerClient } from "../../../../adapters/sse/services/AbstractSseServerClient";

export class SseFastifyServerClient extends AbstractSseServerClient<FastifyRequest, FastifyReply> {}
