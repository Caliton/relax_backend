import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserPayloadDto } from 'src/modules/user/dto/user-payload.dto';
import { UserService } from 'src/modules/user/user.service';
import { CredentialsDto } from './dtos/credentials.dto';
import { ReturnSigninDto } from './dtos/return-signin.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}

  async login(credentialsDto: CredentialsDto): Promise<ReturnSigninDto> {
    const user = await this.validateCredentials(credentialsDto);

    if (!user) throw new UnauthorizedException('Usuário ou senha inválidos');

    const payload = {
      id: user.id,
      name: user.collaborator.name,
      username: user.login,
      role: user.role,
    };

    return { token: this.jwtService.sign(payload), user };
  }

  async validateCredentials(
    credentialsDto: CredentialsDto,
  ): Promise<UserPayloadDto> {
    const { login } = credentialsDto;
    const user = await this.userService.findLogin(login);

    if (!user) return;

    const { password, ...result } = user;

    if (!this.comparePassword(credentialsDto.password, password)) return;

    return result;
  }

  private comparePassword(passData: string, passRequest: string) {
    return passData === passRequest;
  }
}
