export interface MailerInterface {
  sendMail(to: string, subject: string, body: string): Promise<void>;
  sendConfirmationEmail(to: string, token: string): Promise<void>;
  sendWelcomeEmail(to: string): Promise<void>;
}
