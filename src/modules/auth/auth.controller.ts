import { Body, Controller, Post, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthService, AuthPayloadDto } from './auth.service';
import { LocalGuard } from './guards/local.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @UseGuards(LocalGuard)
  async login(@Body() authPayload: AuthPayloadDto) {
    const token = await this.authService.login(authPayload);
    if (token === "Invalid Credentials") {
      throw new UnauthorizedException('Invalid credentials');
    }
    return { userToken: token };
  }
}
