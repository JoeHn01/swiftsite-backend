import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { LocalStrategy } from './strategies/local.strategy';
import { UsersModule } from '../users/users.module';
import { LocalGuard } from './guards/local.guard';
import { AuthController } from './auth.controller';
import * as dotenv from "dotenv";

dotenv.config();

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [AuthService, LocalStrategy, LocalGuard], 
  controllers: [AuthController],
})
export class AuthModule {}
