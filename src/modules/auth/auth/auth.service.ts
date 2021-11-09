import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserPayloadDto } from 'src/modules/user/dto/user-payload.dto';
import { UserService } from 'src/modules/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}

  async login(login: string, password: string) {
    const user = await this.validateCredentials(login, password);

    if (!user) return;

    const payload = {
      id: user.id,
      name: user.collaborator.name,
      username: user.login,
      role: user.role.description,
    };

    return this.jwtService.sign(payload);
  }

  async validateCredentials(
    login: string,
    pass: string,
  ): Promise<UserPayloadDto> {
    const user = await this.userService.findLogin(login);

    if (!user) return;

    const { password, ...result } = user;

    if (!this.comparePassword(pass, password)) return;

    return result;
  }

  private comparePassword(passData: string, passRequest: string) {
    return passData === passRequest;
  }
}
