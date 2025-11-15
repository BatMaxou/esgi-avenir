import { EmailValue } from '../../../domain/values/EmailValue';
import { MailerInterface } from '../../services/email/MailerInterface';

export class SendUpdateSavingsRateEmailUsecase {
  public constructor(
    private readonly mailer: MailerInterface,
  ) {}

  public async execute(
    to: EmailValue,
    newRate: number,
  ): Promise<void> {
    const subject = 'Your savings rate has been updated';
    const body = `
      <h1>Savings Rate Update</h1>
      <p>Dear Customer,</p>
      <p>We would like to inform you that your savings rate has been updated to <strong>${newRate}%</strong>.</p>
      <p>Thank you for choosing our services.</p>
    `

    await this.mailer.sendMail(to.value, subject, body);
  }
}

