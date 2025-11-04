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

  public async sendConfirmationEmail(to: string, link: string): Promise<void> {
    const subject = 'Please confirm your email address';
    const body = `
      <h1>Email Confirmation</h1>
      <p>Thank you for registering. Please confirm your email address by clicking the link below:</p>
      <a href="${link}">Confirm Email</a>
    `;

    await this.sendMail(to, subject, body);
  }

  public async sendWelcomeEmail(to: string): Promise<void> {
    const subject = 'Welcome to Our Service!';
    const body = `
      <h1>Welcome!</h1>
      <p>Thank you for confirming your email address. We're excited to have you on board!</p>
    `;

    await this.sendMail(to, subject, body);
  }
}
