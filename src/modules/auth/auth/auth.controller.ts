import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { Role } from '../role.decorator';
import { RoleGuard } from '../role.guard';
import { AuthService } from './auth.service';
import { JwtGuard } from './jwt.guard';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() body) {
    const token = await this.authService.login(body.login, body.password);

    return token ? { token } : new UnauthorizedException();
  }

  @Role('admin')
  @UseGuards(JwtGuard, RoleGuard)
  @Get('test-auth')
  test(@Req() req) {
    console.log(req.user);
    return {
      name: 'Luiz Carlos',
    };
  }
}
