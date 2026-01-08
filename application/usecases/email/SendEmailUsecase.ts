import { EmailValue } from '../../../domain/values/EmailValue';
import { MailerInterface } from '../../services/email/MailerInterface';

export class SendEmailUsecase {
  public constructor(
    private readonly mailer: MailerInterface,
  ) {}

  public async execute(
    to: EmailValue,
    subject: string,
    body: string,
  ): Promise<void> {
    await this.mailer.sendMail(to.value, subject, body);
  }
}

