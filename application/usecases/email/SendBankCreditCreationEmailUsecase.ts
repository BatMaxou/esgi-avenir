import { EmailValue } from '../../../domain/values/EmailValue';
import { MailerInterface } from '../../services/email/MailerInterface';

export class SendBankCreditCreationEmailUsecase {
  public constructor(
    private readonly mailer: MailerInterface,
  ) {}

  public async execute(
    to: EmailValue,
  ): Promise<void> {
    const subject = 'New bank credit registred';
    const body = `
      <h1>Your bank credit have been accepted</h1>
      <p>We are pleased to inform you that your bank credit application has been successfully registered on our side.</p>
    `;

    await this.mailer.sendMail(to.value, subject, body);
  }
}

