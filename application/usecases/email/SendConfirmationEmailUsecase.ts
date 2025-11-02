import { EmailValue } from '../../../domain/values/EmailValue';
import { MailerInterface } from '../../services/email/MailerInterface';

export class SendConfirmationEmailUsecase {
  public constructor(
    private readonly mailer: MailerInterface,
  ) {}

  public async execute(
    to: EmailValue,
    link: string,
  ): Promise<void> {
    await this.mailer.sendConfirmationEmail(to.value, link);
  }
}

