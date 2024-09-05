import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) { }

  async createUser(email: string, hashedPassword: string, verificationToken: string): Promise<User> {
    console.log("email: ", email, ", hashedPassword : ", hashedPassword, ", verificationToken : ", verificationToken);
    return this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        verificationToken
      },
    });
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async verifyEmail(email: string): Promise<User> {
    return this.prisma.user.update({
      where: { email },
      data: { isEmailVerified: true, verificationToken: null },
    });
  }
}
