// auth.controller.ts
import { Body, Controller, Get, Post, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { SigninPayloadDto, SignupPayloadDto } from './dto/auth.dto';
import { LocalGuard } from './guards/local.guard';
import { JwtAuthGuard } from './guards/jwt.guard';  // Import JwtAuthGuard
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { User } from '../users/users.schema';
import { Request } from 'express';

export interface RequestWithUser extends Request {
  user: User;
}

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @UseGuards(LocalGuard)
  @Post('login')
  async login(@Body() signinPayload: SigninPayloadDto) {
    const token = await this.authService.login(signinPayload);
    if (token === null) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return { userToken: token };
  }

  @Post('signup')
  async signup(@Body() signupPayload: SignupPayloadDto) {
    const { username, name, email, password } = signupPayload;
    const newUser = await this.usersService.addUser(username, name, email, password);
    if (newUser) {
      const token = await this.authService.login({ username, password });
      if (token === null) throw new UnauthorizedException('Invalid credentials');
      return { userToken: token };
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('status')
  status(@Req() req: RequestWithUser) {
    return req.user;
  }
}
