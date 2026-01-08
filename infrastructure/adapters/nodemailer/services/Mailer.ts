import { MailerInterface } from "../../../../application/services/email/MailerInterface";
import { NodemailerTransport } from "../config/NodemailerTransport";

export class Mailer implements MailerInterface {
  private transport: NodemailerTransport;

  public constructor(host: string, port: number, public from: string) {
    this.transport = new NodemailerTransport(host, port);
  };

  public async sendMail(to: string, subject: string, body: string): Promise<void> {
    await this.transport.getTransporter().sendMail({
      from: this.from,
      to,
      subject,
      html: body,
    });
  }
}
