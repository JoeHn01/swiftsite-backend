import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SigninPayloadDto } from './dto/auth.dto';
import { User } from '../users/users.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async validateUser({ username, password }: SigninPayloadDto): Promise<any> {
    const user = await this.userModel.findOne({ username }).exec();
    if (user && await bcrypt.compare(password, user.password)) {
      const { password, ...userWithoutPassword } = user.toObject();
      return userWithoutPassword;
    }
    return null;
  }

  async generateRefreshToken(user: any): Promise<string> {
    return this.jwtService.sign(user, { expiresIn: '7d' });
  }
  
  async login(signinPayload: SigninPayloadDto): Promise<string> {
    const user = await this.validateUser(signinPayload);
    if (user) {
      return this.jwtService.sign(user);
    }
    return null;
  }

  async refreshToken(accessToken: string): Promise<string> {
    const payload = this.jwtService.verify(accessToken);
    const user = await this.userModel.findOne({ username: payload.username });
    if (!user) throw new UnauthorizedException('Invalid access token');
    const userPlain = user.toObject();
    const { password, ...userWithoutPassword } = userPlain;
    return this.generateRefreshToken(userWithoutPassword);
  }  
}
