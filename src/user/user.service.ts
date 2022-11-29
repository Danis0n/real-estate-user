import { Inject, Injectable } from '@nestjs/common';
import {
  CreateUserRequestDto,
  FindOneDto,
  UserDto,
  UserInfoDto,
  UserLoginDto,
} from './user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { Repository } from 'typeorm';
import { UserInfo } from './entity/user.info.entity';
import { UserLogin } from './entity/user.login.entity';
import { UserMapper } from './mappers/user.mapper';

@Injectable()
export class UserService {
  @InjectRepository(User)
  private readonly userRepository: Repository<User>;

  @InjectRepository(UserInfo)
  private readonly userInfoRepository: Repository<UserInfo>;

  @InjectRepository(UserLogin)
  private readonly userLoginRepository: Repository<UserLogin>;

  @Inject(UserMapper)
  private readonly userMapper: UserMapper;

  public async createUser(dto: CreateUserRequestDto) {
    let user: User = this.userMapper.mapToUserCreate(dto);
    user = await this.userRepository.save(user);

    return {
      status: '200',
      user: this.userMapper.mapToUserDto(user),
    };
  }

  public async findAll() {
    return null;
  }

  public async findById(payload: FindOneDto) {
    return undefined;
  }
}
