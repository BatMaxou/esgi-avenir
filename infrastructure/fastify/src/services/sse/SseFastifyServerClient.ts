import { FastifyReply, FastifyRequest } from "fastify";

import { AbstractSseServerClient } from "../../../../adapters/sse/AbstractSseServerClient";

export class SseFastifyServerClient extends AbstractSseServerClient<FastifyRequest, FastifyReply> {}
