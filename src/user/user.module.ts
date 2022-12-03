import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserLogin } from './entity/user.login.entity';
import { UserInfo } from './entity/user.info.entity';
import { User } from './entity/user.entity';
import { UserMapper } from './mappers/user.mapper';
import { UserRepository } from './repository/user.repository';
import { Role } from './entity/role.entity';
import { RoleMapper } from './mappers/role.mapper';
import { RoleRepository } from './repository/role.repository';
import { UserUrInfo } from './entity/user.ur.info.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserLogin, UserInfo, User, Role, UserUrInfo]),
  ],
  providers: [
    UserService,
    UserMapper,
    UserRepository,
    RoleMapper,
    RoleRepository,
  ],
  controllers: [UserController],
})
export class UserModule {}
