import nodemailer, { Transporter } from 'nodemailer';
import winston from 'winston';
import config from '@/config/config';

class GmailService {
    private transporter: Transporter;
    private logger: winston.Logger;

    constructor() {
        this.transporter = nodemailer.createTransport({
            service: config.email.smtp?.host,
            auth: {
                user: config.email.smtp?.auth.user,
                pass: config.email.smtp?.auth.pass,
            },
        });

        this.logger = winston.createLogger({
            level: 'debug',
            format: winston.format.json(),
            transports: [new winston.transports.Console()],
        });
    }

    public async sendMail(payload: any): Promise<void> {
        const { from, to, subject, html } = payload;
        const mailOptions = {
            from: `Cave <${from}>`,
            to: to,
            subject: subject,
            html: html,
        };

        this.logger.info(`Sending mail to - ${to}`);

        try {
            const info = await this.transporter.sendMail(mailOptions);
            this.logger.info('Email sent: ' + info.response);
        } catch (error) {
            this.logger.error('Error sending email: ', error);
        }
    }
}

export default GmailService;
