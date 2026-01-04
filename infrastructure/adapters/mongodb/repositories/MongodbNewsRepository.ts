import {
  NewsRepositoryInterface,
  UpdateNewsPayload,
} from "../../../../application/repositories/NewsRepositoryInterface";
import { News } from "../../../../domain/entities/News";
import { NewsNotFoundError } from "../../../../domain/errors/entities/news/NewsNotFoundError";
import { UserNotFoundError } from "../../../../domain/errors/entities/user/UserNotFoundError";
import { InvalidHtmlContentError } from "../../../../domain/errors/values/html-content/InvalidHtmlContentError";
import { NewsModel } from "../models/NewsModel";
import { UserModel } from "../models/UserModel";
import { getNextSequence } from "../models/CounterModel";
import { AbstractMongoRepository } from "./AbstractMongoRepository";

export class MongodbNewsRepository extends AbstractMongoRepository implements NewsRepositoryInterface {
  public async create(
    news: News
  ): Promise<News | UserNotFoundError | InvalidHtmlContentError> {
    try {
      await this.ensureConnection();

      // Validate author if provided
      if (news.authorId) {
        const author = await UserModel.findOne({ id: news.authorId });
        if (!author) {
          return new UserNotFoundError("User not found.");
        }
      }

      const newsId = await getNextSequence("news_id");

      const createdNews = await NewsModel.create({
        id: newsId,
        title: news.title,
        content: news.content.value,
        authorId: news.authorId,
        createdAt: new Date(),
      });

      const maybeNews = News.from(createdNews);
      if (maybeNews instanceof Error) {
        throw maybeNews;
      }

      return maybeNews;
    } catch (error) {
      return new UserNotFoundError("User not found.");
    }
  }

  public async update(
    news: UpdateNewsPayload
  ): Promise<News | NewsNotFoundError> {
    try {
      await this.ensureConnection();

      const { id, content, ...toUpdate } = news;

      const updateData: any = { ...toUpdate };
      if (content) {
        updateData.content = content.value;
      }

      const updatedNews = await NewsModel.findOneAndUpdate({ id }, updateData, {
        new: true,
      });

      if (!updatedNews) {
        return new NewsNotFoundError("News not found.");
      }

      return await this.findById(id);
    } catch (error) {
      return new NewsNotFoundError("News not found.");
    }
  }

  public async findById(id: number): Promise<News | NewsNotFoundError> {
    try {
      await this.ensureConnection();

      const foundNews = await NewsModel.findOne({ id });

      if (!foundNews) {
        return new NewsNotFoundError("News not found.");
      }

      const maybeNews = News.from(foundNews);
      if (maybeNews instanceof Error) {
        throw maybeNews;
      }

      return maybeNews;
    } catch (error) {
      return new NewsNotFoundError("News not found");
    }
  }

  public async findAllLike(term: string, limit?: number): Promise<News[]> {
    try {
      await this.ensureConnection();

      const query = NewsModel.find({
        title: { $regex: term, $options: "i" },
      }).sort({ createdAt: -1 });

      if (limit) {
        query.limit(limit);
      }

      const foundNewsList = await query.exec();

      const newsList: News[] = [];

      foundNewsList.forEach((foundNews) => {
        const maybeNews = News.from(foundNews);
        if (maybeNews instanceof Error) {
          throw maybeNews;
        }

        newsList.push(maybeNews);
      });

      return newsList;
    } catch (error) {
      return [];
    }
  }

  public async delete(id: number): Promise<boolean | NewsNotFoundError> {
    try {
      await this.ensureConnection();

      const deletedNews = await NewsModel.findOneAndDelete({ id });

      if (!deletedNews) {
        return new NewsNotFoundError("News not found.");
      }

      return true;
    } catch (error) {
      return new NewsNotFoundError("News not found.");
    }
  }
}
