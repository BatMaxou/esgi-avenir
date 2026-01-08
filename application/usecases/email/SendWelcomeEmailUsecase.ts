import { EmailValue } from '../../../domain/values/EmailValue';
import { MailerInterface } from '../../services/email/MailerInterface';

export class SendWelcomeEmailUsecase {
  public constructor(
    private readonly mailer: MailerInterface,
  ) {}

  public async execute(
    to: EmailValue,
  ): Promise<void> {
    const subject = 'Welcome to Our Service!';
    const body = `
      <h1>Welcome!</h1>
      <p>Thank you for confirming your email address. We're excited to have you on board!</p>
    `;

    await this.mailer.sendMail(to.value, subject, body);
  }
}

