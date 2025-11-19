import { EmailValue } from '../../../domain/values/EmailValue';
import { MailerInterface } from '../../services/email/MailerInterface';

export class SendStockPurchaseSucceedEmailUsecase {
  public constructor(
    private readonly mailer: MailerInterface,
  ) {}

  public async execute(
    to: EmailValue,
    stockName: string,
    amount: number,
  ): Promise<void> {
    const subject = `Stock Purchase Successful: ${stockName}`;
    const body = `
      <h1>Stock Purchase Successful</h1>
      <p>Congratulations! Your purchase of 1 share of ${stockName} has been successfully completed for ${amount}.</p>
    `;

    await this.mailer.sendMail(to.value, subject, body);
  }
}

