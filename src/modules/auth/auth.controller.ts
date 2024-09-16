import { Body, Controller, Post, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthService, AuthPayloadDto, SignupPayloadDto } from './auth.service';
import { LocalGuard } from './guards/local.guard';
import { UsersService } from '../users/users.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Post('login')
  @UseGuards(LocalGuard)
  async login(@Body() authPayload: AuthPayloadDto) {
    const token = await this.authService.login(authPayload);
    if (token === null) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return { userToken: token };
  }

  @Post('signup')
  async signup(@Body() signupPayload: SignupPayloadDto) {
    const { username, name, email, password } = signupPayload;
    const newUser = await this.usersService.addUser(username, name, email, password);
    if (newUser){
      const userToken = await this.authService.login({ username, password });
      if (userToken === null) throw new UnauthorizedException('');
      return { userToken: userToken }
    }
  }
}
