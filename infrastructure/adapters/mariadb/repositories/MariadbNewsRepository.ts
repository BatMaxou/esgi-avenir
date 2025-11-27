import { NewsRepositoryInterface, UpdateNewsPayload } from "../../../../application/repositories/NewsRepositoryInterface";
import { News } from "../../../../domain/entities/News";
import { NewsNotFoundError } from "../../../../domain/errors/entities/news/NewsNotFoundError";
import { UserNotFoundError } from "../../../../domain/errors/entities/user/UserNotFoundError";
import { InvalidHtmlContentError } from "../../../../domain/errors/values/html-content/InvalidHtmlContentError";
import { databaseDsn } from "../../../express/utils/tools";
import { MariadbConnection } from "../config/MariadbConnection";
import { NewsModel } from "../models/NewsModel";
import { UserModel } from "../models/UserModel";
import { Op } from "sequelize";

export class MariadbNewsRepository implements NewsRepositoryInterface {
  private newsModel: NewsModel;
  private userModel: UserModel;

  public constructor() {
    const connection = new MariadbConnection(databaseDsn).getConnection();
    this.userModel = new UserModel(connection);
    this.newsModel = new NewsModel(connection, this.userModel);
  }

  public async create(news: News): Promise<News | UserNotFoundError | InvalidHtmlContentError> {
    try {
      const createdNews = await this.newsModel.model.create({
        title: news.title,
        content: news.content.value,
        authorId: news.authorId,
      });

      const maybeNews = News.from(createdNews);
      if (maybeNews instanceof Error) {
        throw maybeNews;
      }

      return maybeNews;
    } catch (error) {
      if (error instanceof Error && error.name === 'SequelizeForeignKeyConstraintError') {
        return new UserNotFoundError('User not found.');
      }

      throw new UserNotFoundError('User not found.');
    }
  }

  public async update(news: UpdateNewsPayload): Promise<News | NewsNotFoundError> {
    try {
      const { id, content, ...toUpdate } = news;

      await this.newsModel.model.update({
        ...toUpdate,
        ...(content ? { content: content.value } : {}),
      }, {
        where: { id },
      });

      return await this.findById(id);
    } catch (error) {
      throw new NewsNotFoundError('News not found.');
    }
  }

  public async findById(id: number): Promise<News | NewsNotFoundError> {
    try {
      const foundNews = await this.newsModel.model.findByPk(
        id,
        {
          include: [
            {
              model: this.userModel.model,
              as: 'author',
            }
          ],
        }
      );
      if (!foundNews) {
        return new NewsNotFoundError('News not found.');
      }

      const maybeNews = News.from(foundNews);
      if (maybeNews instanceof Error) {
        throw maybeNews;
      }

      return maybeNews;
    } catch (error) {
      throw new NewsNotFoundError('News not found');
    }
  }

  public async findAllLike(term: string): Promise<News[]> {
    const foundNewsList = await this.newsModel.model.findAll({
      where: {
        title: {
          [Op.like]: `%${term}%`
        }
      },
      include: [
        {
          model: this.userModel.model,
          as: 'author',
        }
      ],
    });

    const newsList: News[] = [];

    foundNewsList.forEach((foundNews) => {
      const maybeNews = News.from(foundNews);
      if (maybeNews instanceof Error) {
        throw maybeNews;
      }

      newsList.push(maybeNews);
    });

    return newsList;
  }

  public async findLast(limit: number): Promise<News[]> {
    const foundNewsList = await this.newsModel.model.findAll({
      order: [['createdAt', 'DESC']],
      limit,
      include: [
        {
          model: this.userModel.model,
          as: 'author',
        }
      ],
    });

    const newsList: News[] = [];

    foundNewsList.forEach((foundNews) => {
      const maybeNews = News.from(foundNews);
      if (maybeNews instanceof Error) {
        throw maybeNews;
      }

      newsList.push(maybeNews);
    });

    return newsList;
  }

  public async delete(id: number): Promise<boolean | NewsNotFoundError> {
    try {
      const deletedCount = await this.newsModel.model.destroy({ where: { id } });
      if (deletedCount === 0) {
        return new NewsNotFoundError('News not found.');
      }

      return true;
    } catch (error) {
      throw new NewsNotFoundError('News not found.');
    }
  }
}
