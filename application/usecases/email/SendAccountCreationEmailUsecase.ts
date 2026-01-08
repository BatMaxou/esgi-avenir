import { EmailValue } from '../../../domain/values/EmailValue';
import { MailerInterface } from '../../services/email/MailerInterface';

export class SendAccountCreationEmailUsecase {
  public constructor(
    private readonly mailer: MailerInterface,
  ) {}

  public async execute(
    to: EmailValue,
  ): Promise<void> {
    const subject = 'Your Account Has Been Created';
    const body = `
      <h1>Account Created</h1>
      <p>Your account has been successfully created. Thank you for trusting us!</p>
    `;

    await this.mailer.sendMail(to.value, subject, body);
  }
}

