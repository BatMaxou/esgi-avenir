import { EmailValue } from '../../../domain/values/EmailValue';
import { MailerInterface } from '../../services/email/MailerInterface';

export class SendStockSaleSucceedEmailUsecase {
  public constructor(
    private readonly mailer: MailerInterface,
  ) {}

  public async execute(
    to: EmailValue,
    stockName: string,
    amount: number,
  ): Promise<void> {
    const subject = `Stock Sale Successful: ${stockName}`;
    const body = `
      <h1>Stock Sale Successful</h1>
      <p>Congratulations! Your sale of 1 share of ${stockName} has been successfully completed for ${amount}.</p>
    `;

    await this.mailer.sendMail(to.value, subject, body);
  }
}

