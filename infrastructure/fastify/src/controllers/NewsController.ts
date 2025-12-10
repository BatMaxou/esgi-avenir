import { FastifyRequest, FastifyReply } from "fastify";

import { NewsRepositoryInterface } from "../../../../application/repositories/NewsRepositoryInterface";
import { CreateNewsCommand } from "../../../../application/commands/news/CreateNewsCommand";
import { InvalidCreateNewsCommandError } from "../../../../application/errors/commands/news/InvalidCreateNewsCommandError";
import { CreateNewsUsecase } from "../../../../application/usecases/news/CreateNewsUsecase";
import { UpdateNewsParams } from "../../../../application/params/news/UpdateNewsParams";
import { InvalidUpdateNewsCommandError } from "../../../../application/errors/commands/news/InvalidUpdateNewsCommandError";
import { UpdateNewsUsecase } from "../../../../application/usecases/news/UpdateNewsUsecase";
import { NewsNotFoundError } from "../../../../domain/errors/entities/news/NewsNotFoundError";
import { InvalidUpdateNewsParamsError } from "../../../../application/errors/params/news/InvalidUpdateNewsParamsError";
import { DeleteNewsParams } from "../../../../application/params/news/DeleteNewsParams";
import { InvalidDeleteNewsParamsError } from "../../../../application/errors/params/news/InvalidDeleteNewsParamsError";
import { DeleteNewsUsecase } from "../../../../application/usecases/news/DeleteNewsUsecase";
import { GetNewsListUsecase } from "../../../../application/usecases/news/GetNewsListUsecase";
import { GetNewsParams } from "../../../../application/params/news/GetNewsParams";
import { InvalidGetNewsParamsError } from "../../../../application/errors/params/news/InvalidGetNewsParamsError";
import { GetNewsUsecase } from "../../../../application/usecases/news/GetNewsUsecase";
import { GetNewsListQuery, NewsSearchParams } from "../../../../application/queries/news/GetNewsListQuery";
import { UpdateNewsCommand } from "../../../../application/commands/news/UpdateNewsCommand";
import { InvalidGetNewsListQueryError } from "../../../../application/errors/queries/news/InvalidGetNewsListQueryError";
import { HtmlContentValue } from "../../../../domain/values/HtmlContentValue";
import { InvalidHtmlContentError } from "../../../../domain/errors/values/html-content/InvalidHtmlContentError";
import { SseFastifyServerClient } from "../services/sse/SseFastifyServerClient";
import { SubscribeNewsUsecase } from "../../../../application/usecases/news/SubscribeNewsUsecase";
import { CreateNewsPayloadInterface, UpdateNewsPayloadInterface } from "../../../../application/services/api/resources/NewsResourceInterface";
import { RessourceParamsInterface } from "../../../../application/params/RessourceParamsInterface";

export class NewsController {
  public constructor(
    private readonly newsRepository: NewsRepositoryInterface,
    private readonly sseServerClient: SseFastifyServerClient,
  ) {}

  public async create(request: FastifyRequest<{Body: CreateNewsPayloadInterface}>, response: FastifyReply) {
    const maybeCommand = CreateNewsCommand.from(request.body);
    if (maybeCommand instanceof InvalidCreateNewsCommandError) {
      return response.status(400).send({
        error: maybeCommand.message,
      });
    }

    const author = request.user;
    if (!author) {
      return response.status(401).send({
        error: "Unauthorized",
      });
    }

    const createUsecase = new CreateNewsUsecase(this.newsRepository, this.sseServerClient);
    const maybeNews = await createUsecase.execute(
      maybeCommand.title,
      maybeCommand.content,
      author,
    );

    if (maybeNews instanceof Error) {
      return response.status(400).send({
        error: maybeNews.message,
      });
    }

    response.status(201).send({
      id: maybeNews.id,
      title: maybeNews.title,
      content: maybeNews.content,
    });
  }

  public async get(request: FastifyRequest<{Params: RessourceParamsInterface}>, response: FastifyReply) {
    const maybeParams = GetNewsParams.from(request.params);
    if (maybeParams instanceof InvalidGetNewsParamsError) {
      return response.status(400).send({
        error: maybeParams.message,
      });
    }

    const getNewsUsecase = new GetNewsUsecase(this.newsRepository);
    const maybeNews = await getNewsUsecase.execute(maybeParams.id);
    if (maybeNews instanceof NewsNotFoundError) {
      return response.status(404).send({
        error: maybeNews.message,
      });
    }

    response.status(200).send({
      id: maybeNews.id,
      name: maybeNews.title,
      content: maybeNews.content,
      authorId: maybeNews.authorId,
      createdAt: maybeNews.createdAt,
      ...(maybeNews.author ? {
        author: {
          id: maybeNews.author.id,
          firstName: maybeNews.author.firstName,
          lastName: maybeNews.author.lastName,
        }
      } : {})
    });
  }

  public async list(request: FastifyRequest<{Querystring: NewsSearchParams}>, response: FastifyReply) {
    const maybeQuery = GetNewsListQuery.from(request.query);
    if (maybeQuery instanceof InvalidGetNewsListQueryError) {
      return response.status(400).send({
        error: maybeQuery.message,
      });
    }

    const getListUsecase = new GetNewsListUsecase(this.newsRepository);
    const newsList = await getListUsecase.execute(maybeQuery.term || '', maybeQuery.count || 16);

    response.status(200).send(newsList.map((news) => ({
      id: news.id,
      title: news.title,
      content: news.content,
      authorId: news.authorId,
      createdAt: news.createdAt,
      ...(news.author ? {
        author: {
          id: news.author.id,
          firstName: news.author.firstName,
          lastName: news.author.lastName,
        }
      } : {})
    })));
  }

  public async update(request: FastifyRequest<{Params: RessourceParamsInterface, Body: UpdateNewsPayloadInterface}>, response: FastifyReply) {
    const maybeParams = UpdateNewsParams.from(request.params);
    if (maybeParams instanceof InvalidUpdateNewsParamsError) {
      return response.status(400).send({
        error: maybeParams.message,
      });
    }

    const maybeCommand = UpdateNewsCommand.from(request.body);
    if (maybeCommand instanceof InvalidUpdateNewsCommandError) {
      return response.status(400).send({
        error: maybeCommand.message,
      });
    }

    const author = request.user;
    if (!author) {
      return response.status(401).send({
        error: "Unauthorized",
      });
    }

    const maybeContent = maybeCommand.content ? HtmlContentValue.from(maybeCommand.content) : undefined;
    if (maybeContent instanceof InvalidHtmlContentError) {
      return response.status(400).send({
        error: maybeContent.message,
      });
    }

    const updateNewsUsecase = new UpdateNewsUsecase(
      this.newsRepository
    );
    const maybeNews = await updateNewsUsecase.execute(
      author,
      {
        id: maybeParams.id,
        title: maybeCommand.title,
        content: maybeContent,
      }
    );

    if (maybeNews instanceof NewsNotFoundError) {
      return response.status(404).send({
        error: maybeNews.message,
      });
    }

    if (maybeNews instanceof Error) {
      return response.status(400).send({
        error: maybeNews.message,
      });
    }

    response.status(200).send({
      id: maybeNews.id,
      title: maybeNews.title,
      content: maybeNews.content,
    });
  }

  public async delete(request: FastifyRequest<{Params: RessourceParamsInterface}>, response: FastifyReply) {
    const maybeParams = DeleteNewsParams.from(request.params);
    if (maybeParams instanceof InvalidDeleteNewsParamsError) {
      return response.status(400).send({
        error: maybeParams.message,
      });
    }

    const author = request.user;
    if (!author) {
      return response.status(401).send({
        error: "Unauthorized",
      });
    }

    const deleteNewsUsecase = new DeleteNewsUsecase(
      this.newsRepository
    );
    const maybeSuccess = await deleteNewsUsecase.execute(
      maybeParams.id,
      author
    );

    if (maybeSuccess instanceof NewsNotFoundError) {
      return response.status(404).send({
        error: maybeSuccess.message,
      });
    }

    response.status(200).send({
      success: maybeSuccess,
    });
  }

  public subscribe(request: FastifyRequest, response: FastifyReply) {
    const user = request.user;
    if (!user || !user.id) {
      return response.status(401).send({
        error: "Unauthorized",
      });
    }

    const subscribeUsecase = new SubscribeNewsUsecase(this.sseServerClient);
    subscribeUsecase.execute(request, response, user);
  }
}
