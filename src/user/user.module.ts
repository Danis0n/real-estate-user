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
import { IMAGE_PACKAGE_NAME, IMAGE_SERVICE_NAME } from './proto/image.pb';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { UserValidator } from './utils/user.validator';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserLogin, UserInfo, User, Role, UserUrInfo]),
    ClientsModule.register([
      {
        name: IMAGE_SERVICE_NAME,
        transport: Transport.GRPC,
        options: {
          url: '0.0.0.0:50053',
          package: IMAGE_PACKAGE_NAME,
          protoPath: 'node_modules/proto-config/proto/image.proto',
        },
      },
    ]),
  ],
  providers: [
    UserService,
    UserMapper,
    UserRepository,
    RoleMapper,
    RoleRepository,
    UserValidator,
  ],
  controllers: [UserController],
})
export class UserModule {}
