import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { env } from 'src/shared/config/env';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      signOptions: { expiresIn: '7d' },
      secret: env.jwtSecret,
  })
],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
