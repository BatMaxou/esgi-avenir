import { createTransport, Transporter } from 'nodemailer';

export class NodemailerTransport {
  private transporter: Transporter;
  
  public constructor(host: string, port: number) {
    this.transporter = createTransport({
      host,
      port,
    });
  }

  public getTransporter() {
    return this.transporter;
  }
}
