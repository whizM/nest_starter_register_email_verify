import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
    private transporter: nodemailer.Transporter;

    constructor(private configService: ConfigService) {
        this.transporter = nodemailer.createTransport({
            host: this.configService.get('SMTP_HOST'),
            port: this.configService.get('SMTP_PORT'),
            auth: {
                user: this.configService.get('SMTP_USER'),
                pass: this.configService.get('SMTP_PASS'),
            },
        });
    }

    async sendVerificationEmail(email: string, token: string): Promise<void> {
        const verificationUrl = this.configService.get('FRONTEND_URL') + `/verify-email?token=${token}`;

        await this.transporter.sendMail({
            from: 'info@mypointe.xsrv.jp',
            to: email,
            subject: 'Verify Your Email',
            html: `
        <p>Please click the link below to verify your email:</p>
        <a href="${verificationUrl}">${verificationUrl}</a>
      `,
        });
    }
}
