import axios from 'axios';
import { LoggingService } from './logging/logging.service';

export class SMSUtils {
  private readonly FAST2SMS_API_KEY = process.env.FAST2SMS_API_KEY;
  private readonly FAST2SMS_URL = process.env.SMS_API_ENDPOINT;
  private readonly logger: LoggingService;

  constructor(logger: LoggingService) {
    this.logger = logger;
  }

  async sendOTP(mobile: string, otp: string): Promise<boolean> {
    try {
      const message = `Your OTP for loan verification is ${otp}. Valid for 10 minutes.`;
      const response = await axios.post(
        this.FAST2SMS_URL,
        {
          route: 'v3', // For OTP messages
          sender_id: 'LOANVR', // Your sender ID
          message,
          language: 'english',
          flash: 0,
          numbers: mobile,
        },
        {
          headers: {
            'authorization': this.FAST2SMS_API_KEY,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.return === true) {
        await this.logger.info('SMS sent successfully', { mobile, messageId: response.data.request_id });
        return true;
      } else {
        await this.logger.error('Failed to send SMS', { 
          mobile, 
          error: response.data.message 
        });
        return false;
      }
    } catch (error) {
      await this.logger.error('Error sending SMS', { 
        mobile, 
        error: error.message,
        stack: error.stack 
      });
      return false;
    }
  }

  async sendVerificationStatus(mobile: string, status: string, loanId: string): Promise<boolean> {
    try {
      const message = `Your loan verification (ID: ${loanId}) has been ${status}. Check your dashboard for details.`;
      const response = await axios.post(
        this.FAST2SMS_URL,
        {
          route: 'q', // For promotional messages
          sender_id: 'LOANVR',
          message,
          language: 'english',
          flash: 0,
          numbers: mobile,
        },
        {
          headers: {
            'authorization': this.FAST2SMS_API_KEY,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.return === true) {
        await this.logger.info('Status SMS sent successfully', { 
          mobile, 
          loanId, 
          status,
          messageId: response.data.request_id 
        });
        return true;
      } else {
        await this.logger.error('Failed to send status SMS', { 
          mobile, 
          loanId, 
          status,
          error: response.data.message 
        });
        return false;
      }
    } catch (error) {
      await this.logger.error('Error sending status SMS', { 
        mobile, 
        loanId, 
        status,
        error: error.message,
        stack: error.stack 
      });
      return false;
    }
  }

  async sendDltTemplate(
    mobile: string,
    templateMessageId: string,
    variablesValues: string,
    context: Record<string, any> = {},
  ): Promise<boolean> {
    try {
      const smsRoute = process.env.SMS_ROUTE;
      const senderId = process.env.SMS_DLT_SENDER_ID;

      const missing = [
        ['FAST2SMS_API_KEY', this.FAST2SMS_API_KEY],
        ['SMS_API_ENDPOINT', this.FAST2SMS_URL],
        ['SMS_ROUTE', smsRoute],
        ['SMS_DLT_SENDER_ID', senderId],
        ['templateMessageId', templateMessageId],
      ]
        .filter(([, v]) => !v)
        .map(([k]) => k);

      if (missing.length > 0) {
        await this.logger.error('DLT SMS configuration missing', {
          missing,
          ...context,
        });
        return false;
      }

      const response = await axios.post(
        this.FAST2SMS_URL,
        {
          route: smsRoute,
          sender_id: senderId,
          message: templateMessageId,
          language: 'english',
          variables_values: variablesValues,
          flash: 0,
          numbers: mobile,
        },
        {
          headers: {
            authorization: this.FAST2SMS_API_KEY,
            'Content-Type': 'application/json',
          },
        },
      );

      if (response.data.return === true) {
        await this.logger.info('DLT SMS sent successfully', {
          mobile,
          templateMessageId,
          messageId: response.data.request_id,
          ...context,
        });
        return true;
      }
      await this.logger.error('Failed to send DLT SMS', {
        mobile,
        templateMessageId,
        error: response.data.message,
        ...context,
      });
      return false;
    } catch (error) {
      await this.logger.error('Error sending DLT SMS', {
        mobile,
        templateMessageId,
        error: error.message,
        stack: error.stack,
        ...context,
      });
      return false;
    }
  }

  async sendVerificationAssigned(mobile: string, loanId: string, executiveName: string): Promise<boolean> {
    try {
      const message = `Your loan verification (ID: ${loanId}) has been assigned to ${executiveName}. They will contact you shortly.`;
      const response = await axios.post(
        this.FAST2SMS_URL,
        {
          route: 'q',
          sender_id: 'LOANVR',
          message,
          language: 'english',
          flash: 0,
          numbers: mobile,
        },
        {
          headers: {
            'authorization': this.FAST2SMS_API_KEY,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.return === true) {
        await this.logger.info('Assignment SMS sent successfully', { 
          mobile, 
          loanId, 
          executiveName,
          messageId: response.data.request_id 
        });
        return true;
      } else {
        await this.logger.error('Failed to send assignment SMS', { 
          mobile, 
          loanId, 
          executiveName,
          error: response.data.message 
        });
        return false;
      }
    } catch (error) {
      await this.logger.error('Error sending assignment SMS', { 
        mobile, 
        loanId, 
        executiveName,
        error: error.message,
        stack: error.stack 
      });
      return false;
    }
  }
}
