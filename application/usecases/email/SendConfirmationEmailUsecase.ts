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
    const subject = 'Please confirm your email address';
    const body = `
      <h1>Email Confirmation</h1>
      <p>Thank you for registering. Please confirm your email address by clicking the link below:</p>
      <a href="${link}">Confirm Email</a>
    `;

    await this.mailer.sendMail(to.value, subject, body);
  }
}

