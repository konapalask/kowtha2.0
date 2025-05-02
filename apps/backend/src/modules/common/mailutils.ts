import { SES } from 'aws-sdk';

const ses = new SES({
  region: process.env.AWS_REGION || 'us-east-1',
});

export interface EmailOptions {
  from: string;
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  replyTo?: string | string[];
  cc?: string | string[];
  bcc?: string | string[];
}

export class EmailService {
  private defaultFrom: string;

  constructor(defaultFrom: string) {
    this.defaultFrom = defaultFrom;
  }

  private validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private validateEmails(emails: string | string[]): boolean {
    if (Array.isArray(emails)) {
      return emails.every(email => this.validateEmail(email));
    }
    return this.validateEmail(emails);
  }

  async sendEmail(options: EmailOptions): Promise<string> {
    const { from, to, subject, html, text, replyTo, cc, bcc } = options;

    // Validate email addresses
    if (!this.validateEmail(from)) {
      throw new Error('Invalid sender email address');
    }
    if (!this.validateEmails(to)) {
      throw new Error('Invalid recipient email address(es)');
    }
    if (replyTo && !this.validateEmails(replyTo)) {
      throw new Error('Invalid reply-to email address(es)');
    }
    if (cc && !this.validateEmails(cc)) {
      throw new Error('Invalid CC email address(es)');
    }
    if (bcc && !this.validateEmails(bcc)) {
      throw new Error('Invalid BCC email address(es)');
    }

    const params: SES.SendEmailRequest = {
      Source: from,
      Destination: {
        ToAddresses: Array.isArray(to) ? to : [to],
        CcAddresses: cc ? (Array.isArray(cc) ? cc : [cc]) : undefined,
        BccAddresses: bcc ? (Array.isArray(bcc) ? bcc : [bcc]) : undefined,
      },
      Message: {
        Subject: {
          Data: subject,
          Charset: 'UTF-8',
        },
        Body: {
          ...(html && {
            Html: {
              Data: html,
              Charset: 'UTF-8',
            },
          }),
          ...(text && {
            Text: {
              Data: text,
              Charset: 'UTF-8',
            },
          }),
        },
      },
      ...(replyTo && {
        ReplyToAddresses: Array.isArray(replyTo) ? replyTo : [replyTo],
      }),
    };

    try {
      const result = await ses.sendEmail(params).promise();
      return result.MessageId;
    } catch (error) {
      throw new Error(`Failed to send email: ${error.message}`);
    }
  }

  async sendTemplatedEmail(
    templateName: string,
    templateData: Record<string, any>,
    options: Omit<EmailOptions, 'html' | 'text'>
  ): Promise<string> {
    const { from, to, subject, replyTo, cc, bcc } = options;

    const params: SES.SendTemplatedEmailRequest = {
      Source: from,
      Destination: {
        ToAddresses: Array.isArray(to) ? to : [to],
        CcAddresses: cc ? (Array.isArray(cc) ? cc : [cc]) : undefined,
        BccAddresses: bcc ? (Array.isArray(bcc) ? bcc : [bcc]) : undefined,
      },
      Template: templateName,
      TemplateData: JSON.stringify(templateData),
      ...(replyTo && {
        ReplyToAddresses: Array.isArray(replyTo) ? replyTo : [replyTo],
      }),
    };

    try {
      const result = await ses.sendTemplatedEmail(params).promise();
      return result.MessageId;
    } catch (error) {
      throw new Error(`Failed to send templated email: ${error.message}`);
    }
  }
}

// Create a default email service instance
export const emailService = new EmailService(
  process.env.DEFAULT_FROM_EMAIL || 'noreply@example.com'
);
