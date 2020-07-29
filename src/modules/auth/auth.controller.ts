import { Controller, UseGuards, Post,Request, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local.guard';
import { UserDto } from '../users/dto/user.dto';
1
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Request() req){
        return await this.authService.login(req.user);
    }

    @Post('signup')
    async signUp(@Body() user: UserDto){
        return await this.authService.create(user);
    }
}
