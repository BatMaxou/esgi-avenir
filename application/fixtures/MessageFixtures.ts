import { Message } from "../../domain/entities/Message";
import { MessageRepositoryInterface } from "../repositories/MessageRepositoryInterface";

type MockMessage = {
  content: string;
  channelId: number;
  userId: number;
}

export class MessageFixtures {
  public constructor(
    private readonly repository: MessageRepositoryInterface,
  ) {}

  public async load(): Promise<boolean | Error> {
    const companyMessages: MockMessage[] = [
      {
        content: 'Welcome to the company channel!',
        channelId: 1,
        userId: 1,
      },
      {
        content: 'Hi !',
        channelId: 1,
        userId: 5,
      },
    ];

    for (const message of companyMessages) {
      await this.createCompanyMessage(message);
    }

    const privateMessages: MockMessage[] = [
      {
        content: 'I have a problem with my bank credit.',
        channelId: 1,
        userId: 2,
      },
      {
        content: 'I really need help to resolve this issue.',
        channelId: 1,
        userId: 2,
      },
      {
        content: 'Hello in private channel! I want some investment advice.',
        channelId: 2,
        userId: 2,
      },
      {
        content: 'Hey there! How can I help you with your investment?',
        channelId: 2,
        userId: 5,
      },
    ];

    for (const message of privateMessages) {
      await this.createPrivateMessage(message);
    }

    return true;
  }

  private async createCompanyMessage(mockCompanyMessage: MockMessage): Promise<boolean | Error> {
    const maybeCompanyMessage = Message.from(mockCompanyMessage);
    if (maybeCompanyMessage instanceof Error) {
      return maybeCompanyMessage;
    }

    const maybeError = await this.repository.createCompany(maybeCompanyMessage);
    if (maybeError instanceof Error) {
      return maybeError;
    }

    return true;
  }

  private async createPrivateMessage(mockPrivateMessage: MockMessage): Promise<boolean | Error> {
    const maybePrivateMessage = Message.from(mockPrivateMessage);
    if (maybePrivateMessage instanceof Error) {
      return maybePrivateMessage;
    }

    const maybeError = await this.repository.createPrivate(maybePrivateMessage);
    if (maybeError instanceof Error) {
      return maybeError;
    }

    return true;
  }
}
