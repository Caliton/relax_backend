import { Injectable, Inject } from '@nestjs/common';
import { User } from './user.entity';
import { UserDto } from './dto/user.dto';
import { USER_REPOSITORY } from '../../core/constants';

@Injectable()
export class UsersService {

    constructor(@Inject(USER_REPOSITORY) private readonly userRepository: typeof User) { }

    async create(user: UserDto): Promise<User> {
        return await this.userRepository.create<User>(user);    
    }

    async findOneByLogin(login: string): Promise<User> {
        return await this.userRepository.findOne<User>({ where: { login } });
    }

    async findOneById(id: number): Promise<User> {
        return await this.userRepository.findOne<User>({ where: { id } });
    }
    
    async UpdateUser(id: number, user: User): Promise<boolean> {
        return await this.userRepository.update<User>(user, { where : { id }})[0] > 0;
    }
}