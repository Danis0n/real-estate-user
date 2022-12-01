import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserLogin } from './entity/user.login.entity';
import { UserInfo } from './entity/user.info.entity';
import { User } from './entity/user.entity';
import { UserMapper } from './mappers/user.mapper';
import { UserRepository } from './repository/user.repository';

@Module({
  imports: [TypeOrmModule.forFeature([UserLogin, UserInfo, User])],
  providers: [UserService, UserMapper, UserRepository],
  controllers: [UserController],
})
export class UserModule {}
