import { IsPublic } from 'src/shared/decorators/IsPublic';
import { AuthService } from './auth.service';
import { SigninDTO } from './dtos/signin';
import { SignUpDTO } from './dtos/signup.dto';
import { Body, Controller, Post } from '@nestjs/common';

@IsPublic()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  signin(@Body() signinDto: SigninDTO){
    return this.authService.signin(signinDto);
  }
  
  @Post('signup')
  create(@Body() signupDto: SignUpDTO) {
    return this.authService.signup(signupDto);
  }
}
