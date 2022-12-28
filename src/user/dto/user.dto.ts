import {
  CreateUserRequest,
  FindOneUserEmailRequest,
  FindOneUserInnRequest,
  FindOneUserLoginRequest,
  FindOneUserPhoneRequest,
  FindOneUserRequest,
  User,
  UserInfo,
  UserLogin,
  UserUrInfo,
} from '../proto/user.pb';
import { RoleDto } from './role.dto';

export class CreateUserRequestDto implements CreateUserRequest {
  public readonly email: string;
  public readonly password: string;
  public readonly login: string;
  public readonly phone: string;
  public readonly firstName: string;
  public readonly lastName: string;
  public readonly dateOfBirth: string;
  public readonly inn: string;
  public readonly link: string;
}

export class FindOneDto implements FindOneUserRequest {
  id: string;
}

export class FindLoginDto implements FindOneUserLoginRequest {
  login: string;
}

export class FindPhoneDto implements FindOneUserPhoneRequest {
  phone: string;
}

export class FindEmailDto implements FindOneUserEmailRequest {
  email: string;
}

export class FindInnDto implements FindOneUserInnRequest {
  inn: string;
}

export class UserDto implements User {
  public id: string;
  public email: string;
  public phone: string;
  public siteLink: string;
  public userInfo: UserInfoDto | undefined;
  public userLogin: UserLoginDto | undefined;
  public userUr: UserUrInfoDto | undefined;
  public imageUrl: string;
  public date: string;
  roles: RoleDto[];
}

export class UserUrInfoDto implements UserUrInfo {
  address: string;
  description: string;
  inn: string;
  link: string;
}

export class UserLoginDto implements UserLogin {
  public login: string;
}

export class UserInfoDto implements UserInfo {
  public birthDate: string;
  public description: string;
  public firstName: string;
  public lastName: string;
  public enabled: boolean;
  public locked: boolean;
}
