import { User } from '../entity/user.entity';
import {
  UserDto,
  UserInfoDto,
  UserLoginDto,
  UserUrInfoDto,
} from '../dto/user.dto';
import { UserLogin } from '../entity/user.login.entity';
import { UserInfo } from '../entity/user.info.entity';
import { v4 as uuidv4 } from 'uuid';
import { CreateUserRequestDto } from '../dto/user.dto';
import { Inject } from '@nestjs/common';
import { RoleMapper } from './role.mapper';
import { UserUrInfo } from '../entity/user.ur.info.entity';

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
    if (dto.inn != '' && dto.link != '')
      user.ur = this.mapToUserUrInfoCreate(dto.inn, dto.link);
    return user;
  }

  public mapToUserUrInfoCreate(inn: string, link: string): UserUrInfo {
    const ur = new UserUrInfo();
    ur.inn = inn;
    ur.link = link;
    return ur;
  }

  public mapToUserInfoCreate(dto): UserInfo {
    const info = new UserInfo();
    info.birthData = dto.birthData;
    info.firstName = dto.firstName;
    info.lastName = dto.lastName;
    info.enabled = false;
    info.locked = false;
    return info;
  }

  public mapToUserDto(user: User): UserDto {
    if (!user) return null;
    const dto = new UserDto();
    dto.id = user.uuid;
    dto.userInfo = this.mapToUserInfoDto(user.info);
    dto.userLogin = this.mapToUserLoginDto(user.login);
    dto.userUr = this.mapToUserUrInfo(user.ur);
    dto.roles = this.roleMapper.mapToRoleDtoArray(user.roles);
    dto.phone = user.phone;
    dto.email = user.email;
    dto.date = user.date.toString();
    return dto;
  }

  public mapToArrayUserDto(users: User[]): UserDto[] {
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
    userInfo.birthDate = info.birthData.toString();
    return userInfo;
  }

  public mapToUserInfo(dto: UserInfoDto): UserInfo {
    const userInfo = new UserInfo();
    userInfo.firstName = dto.firstName;
    userInfo.lastName = dto.lastName;
    userInfo.birthData = dto.birthDate;
    return userInfo;
  }

  private mapToUserUrInfo(ur: UserUrInfo): UserUrInfoDto {
    if (!ur) return null;
    const urDto = new UserUrInfoDto();
    urDto.inn = ur.inn;
    urDto.link = ur.link;
    urDto.description = ur.description;
    urDto.address = ur.address;
    return urDto;
  }
}
