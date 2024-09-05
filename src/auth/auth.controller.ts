import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('register')
    async register(@Body() body: { email: string; password: string; }) {
        await this.authService.register(body.email, body.password);
        return { message: 'Registration successful. Please check your email to verify your account.' };
    }

    @Get('verify-email')
    async verifyEmail(@Query('token') token: string, @Query('email') email: string) {
        await this.authService.verifyEmail(token, email);
        return { message: 'Email verified successfully.' };
    }

    @Post('login')
    async login(@Body() body: { email: string; password: string }) {
        const token = await this.authService.login(body.email, body.password);
        return { token };
    }
}
