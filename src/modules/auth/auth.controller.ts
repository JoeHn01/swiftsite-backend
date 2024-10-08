import { Body, Controller, Get, Post, Req, UnauthorizedException, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { SigninPayloadDto, SignupPayloadDto } from './dto/auth.dto';
import { LocalGuard } from './guards/local.guard';
import { JwtAuthGuard } from './guards/jwt.guard';
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
    try {
      const token = await this.authService.login(signinPayload);
      if (token === null) {
        throw new UnauthorizedException('Invalid credentials');
      }
      return { userToken: token };
    } catch (error) {
      throw new HttpException(error.message || 'Failed to login', HttpStatus.UNAUTHORIZED);
    }
  }

  @Post('signup')
  async signup(@Body() signupPayload: SignupPayloadDto) {
    try {
      const { username, name, email, password } = signupPayload;
      const newUser = await this.usersService.addUser(username, name, email, password);
      if (newUser) {
        const token = await this.authService.login({ username, password });
        if (token === null) {
          throw new UnauthorizedException('Invalid credentials');
        }
        return { userToken: token };
      }
    } catch (error) {
      throw new HttpException(error.message || 'Failed to signup', HttpStatus.BAD_REQUEST);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('status')
  tokenStatus(@Req() req: RequestWithUser) {
    try {
      return req.user;
    } catch (error) {
      throw new HttpException('Failed to retrieve user status', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('refresh-token')
  async refreshToken(@Body('accessToken') accessToken: string) {
    try {
      if (!accessToken) {
        throw new UnauthorizedException('Access token is required');
      }
      const newAccessToken = await this.authService.refreshToken(accessToken);
      if (!newAccessToken) {
        throw new UnauthorizedException('Invalid access token');
      }
      return { accessToken: newAccessToken };
    } catch (error) {
      throw new HttpException(error.message || 'Failed to refresh token', HttpStatus.UNAUTHORIZED);
    }
  }
}
