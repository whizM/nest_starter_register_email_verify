import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { EmailService } from '../email/email.service';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService,
        private emailService: EmailService,
    ) { }

    async register(email: string, password: string): Promise<void> {
        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationToken = uuidv4();

        await this.userService.createUser(email, hashedPassword, verificationToken);
        await this.emailService.sendVerificationEmail(email, verificationToken);
    }

    async verifyEmail(token: string, email: string): Promise<void> {
        const user = await this.userService.findUserByEmail(email);
        if (!user || user.verificationToken !== token) {
            throw new UnauthorizedException('Invalid verification token');
        }

        await this.userService.verifyEmail(user.email);
    }

    async login(email: string, password: string): Promise<string> {
        const user = await this.userService.findUserByEmail(email);
        if (!user || !user.isEmailVerified) {
            throw new UnauthorizedException('Invalid credentials or email not verified');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        return this.jwtService.sign({ userId: user.id, email: user.email });
    }
}
