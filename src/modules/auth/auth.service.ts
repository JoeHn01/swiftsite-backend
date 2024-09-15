import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../users/users.schema';
import * as bcrypt from 'bcrypt';

export class AuthPayloadDto {
  username: string;
  password: string;
}

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async validateUser({ username, password }: AuthPayloadDto): Promise<any> {
    const user = await this.userModel.findOne({ username }).exec();
    if (user && await bcrypt.compare(password, user.password)) {
      const { password, ...userWithoutPassword } = user.toObject();
      return userWithoutPassword;
    }
    return null;
  }

  async login(authPayload: AuthPayloadDto): Promise<string> {
    const user = await this.validateUser(authPayload);
    if (user) {
      return this.jwtService.sign(user);
    }
    return "Invalid Credentials";
  }
}
