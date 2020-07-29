import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from './jwt.strategy';


@Module({
    imports: [
        PassportModule,
        UsersModule,
        JwtModule.register({
                secret: 'mysecret',
                signOptions: {expiresIn: 300}
            }
        )
    ],
    controllers: [
        AuthController, ],
    providers: [
        AuthService,
        LocalStrategy,
        JwtStrategy
     ],
})
export class AuthModule {}
