import { User } from '../entity/user.entity';
import { UserDto, UserInfoDto, UserLoginDto } from '../dto/user.dto';
import { UserLogin } from '../entity/user.login.entity';
import { UserInfo } from '../entity/user.info.entity';
import { v4 as uuidv4 } from 'uuid';
import { CreateUserRequestDto } from '../dto/user.dto';
import { Inject } from '@nestjs/common';
import { RoleMapper } from './role.mapper';

export class UserMapper {
  @Inject(RoleMapper)
  private readonly roleMapper: RoleMapper;

  public mapToUserCreate(dto: CreateUserRequestDto): User {
    const user = new User();
    user.uuid = uuidv4();
    user.info = this.mapToUserInfoCreate({
      lastName: dto.lastName,
      firstName: dto.firstName,
      birthData: dto.dateOfBirth,
    });
    user.login = this.mapToUserLogin({ login: dto.login }, dto.password);
    user.email = dto.email;
    user.phone = dto.phone;
    user.date = new Date();
    return user;
  }

  public mapToUserInfoCreate(dto): UserInfo {
    const info = new UserInfo();
    info.birthData = dto.birthData;
    info.firstName = dto.firstName;
    info.lastName = dto.lastName;
    info.enabled = true;
    info.locked = false;
    return info;
  }

  public mapToUserDto(user: User): UserDto {
    const dto = new UserDto();
    dto.userInfo = this.mapToUserInfoDto(user.info);
    dto.userLogin = this.mapToUserLoginDto(user.login);
    dto.id = user.uuid;
    dto.phone = user.phone;
    dto.email = user.email;
    dto.siteLink = user.link;
    dto.date = user.date.toString();
    dto.roles = this.roleMapper.mapToRoleDtoArray(user.roles);
    return dto;
  }

  public mapArrayUsersDto(users: User[]): UserDto[] {
    const usersDto: UserDto[] = [];
    users.forEach((User) => {
      usersDto.push(this.mapToUserDto(User));
    });
    return usersDto;
  }

  public mapToUserEntity(dto: UserDto, password: string): User {
    const user = new User();
    user.email = dto.email;
    user.phone = dto.phone;
    user.login = this.mapToUserLogin(dto.userLogin, password);
    user.info = this.mapToUserInfo(dto.userInfo);
    user.date = new Date();
    user.link = null;
    user.uuid = uuidv4();

    return user;
  }

  public mapToUserLoginDto(login: UserLogin): UserLoginDto {
    const userLogin = new UserLoginDto();
    userLogin.login = login.login;
    return userLogin;
  }

  public mapToUserLogin(dto: UserLoginDto, password: string): UserLogin {
    const userLogin = new UserLogin();
    userLogin.login = dto.login;
    userLogin.password = password;
    return userLogin;
  }

  public mapToUserInfoDto(info: UserInfo): UserInfoDto {
    const userInfo = new UserInfoDto();
    userInfo.firstName = info.firstName;
    userInfo.lastName = info.lastName;
    userInfo.birthData = info.birthData.toString();
    userInfo.description = info.description;
    return userInfo;
  }

  public mapToUserInfo(dto: UserInfoDto): UserInfo {
    const userInfo = new UserInfo();
    userInfo.firstName = dto.firstName;
    userInfo.lastName = dto.lastName;
    userInfo.description = '';
    userInfo.birthData = dto.birthData;

    return userInfo;
  }
}
