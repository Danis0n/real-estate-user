import { Injectable } from '@nestjs/common';
import {
  CreateUserRequestDto,
  FindOneDto,
  UserDto,
  UserInfoDto,
  UserLoginDto,
} from './user.dto';

@Injectable()
export class UserService {
  async createUser(dto: CreateUserRequestDto) {
    const user = this.fillUserTest(dto);

    return {
      status: '200',
      user: user,
    };
  }

  //little mapper for a while
  private fillUserTest(dto: CreateUserRequestDto): UserDto {
    const user = new UserDto();
    const userInfo = new UserInfoDto();
    userInfo.firstName = dto.firstName;
    userInfo.lastName = dto.lastName;
    userInfo.birthData = dto.dateOfBirth;
    userInfo.description = 'empty-text';
    user.userInfo = userInfo;

    const userLogin = new UserLoginDto();
    userLogin.login = dto.login;
    user.userLogin = userLogin;

    user.id = '1';
    user.email = dto.email;
    user.phone = dto.phone;
    user.imageUrl = '....';
    user.siteLink = 'empty here';
    return user;
  }

  async findAll() {
    return null;
  }

  async findById(payload: FindOneDto) {
    return undefined;
  }
}
