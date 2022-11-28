import {
  CreateUserRequest,
  FindOneUserRequest,
  User,
  UserInfo,
  UserLogin,
} from './user.pb';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  Length,
} from 'class-validator';

export class CreateUserRequestDto implements CreateUserRequest {
  public readonly email: string;
  public readonly password: string;
  public readonly login: string;
  public readonly phone: string;
  public readonly firstName: string;
  public readonly lastName: string;
  public readonly dateOfBirth: string;
}

export class FindOneDto implements FindOneUserRequest {
  @IsNumber({ allowInfinity: false, allowNaN: false })
  id: string;
}

export class UserDto implements User {
  public id: string;
  public email: string;
  public phone: string;
  public siteLink: string;
  public userInfo: UserInfoDto | undefined;
  public userLogin: UserLoginDto | undefined;
  public imageUrl: string;
}

export class UserLoginDto implements UserLogin {
  public login: string;
}

export class UserInfoDto implements UserInfo {
  public birthData: string;
  public description: string;
  public firstName: string;
  public lastName: string;
}

export class FindOneRequestDto implements FindOneUserRequest {
  @IsNumber({ allowInfinity: false, allowNaN: false })
  public readonly id: string;
}
