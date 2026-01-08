import { EmailValue } from '../../../domain/values/EmailValue';
import { MailerInterface } from '../../services/email/MailerInterface';

export class SendAccountDeletionEmailUsecase {
  public constructor(
    private readonly mailer: MailerInterface,
  ) {}

  public async execute(
    to: EmailValue,
  ): Promise<void> {
    const subject = 'Your Account Has Been Deleted';
    const body = `
      <h1>Account Deleted</h1>
      <p>Your account has been successfully deleted.</p>
    `;

    await this.mailer.sendMail(to.value, subject, body);
  }
}

