import { EmailValue } from '../../../domain/values/EmailValue';
import { MailerInterface } from '../../services/email/MailerInterface';

export class SendBeneficiaryCreationEmailUsecase {
  public constructor(
    private readonly mailer: MailerInterface,
  ) {}

  public async execute(
    name: string,
    to: EmailValue,
  ): Promise<void> {
    const subject = 'New Beneficiary Added to Your Account';
    const body = `
      <h1>Beneficiary Created</h1>
      <p>The beneficiary <strong>${name}</strong> has been successfully added to your account.</p>
    `;

    await this.mailer.sendMail(to.value, subject, body);
  }
}

