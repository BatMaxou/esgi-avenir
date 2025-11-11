export interface MailerInterface {
  sendMail(to: string, subject: string, body: string): Promise<void>;
}
