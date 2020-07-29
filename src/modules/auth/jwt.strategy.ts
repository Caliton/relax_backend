import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly userService:UsersService){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false, //TODO: Add expiration 
            secretOrKey: 'mysecret',
             
        });
    }

    async validate(payload: any){
        const user = await this.userService.findOneById(payload.id);
        if(!user){
            throw new UnauthorizedException('You are not authorized to perfom the operation');
        }
        return payload;
    }
} 