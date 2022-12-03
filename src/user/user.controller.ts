import { Controller, Inject } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import {
  CreateRoleResponse,
  CreateUserResponse,
  FindAllUsersResponse,
  FindOneUserResponse,
  USER_SERVICE_NAME,
} from './user.pb';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  @Inject(UserService)
  private readonly service: UserService;

  @GrpcMethod(USER_SERVICE_NAME, 'Create')
  private async createUser(payload): Promise<CreateUserResponse> {
    return this.service.createUser(payload);
  }

  @GrpcMethod(USER_SERVICE_NAME, 'FindAll')
  private async findAll(): Promise<FindAllUsersResponse> {
    return this.service.findAll();
  }

  @GrpcMethod(USER_SERVICE_NAME, 'FindById')
  private async findById(payload): Promise<FindOneUserResponse> {
    return this.service.findById(payload);
  }

  @GrpcMethod(USER_SERVICE_NAME, 'CreateRole')
  private async createRole(payload): Promise<CreateRoleResponse> {
    return this.service.createRole(payload);
  }

  @GrpcMethod(USER_SERVICE_NAME, 'FindByLogin')
  private async findByLogin(payload): Promise<FindOneUserResponse> {
    return this.service.findByLogin(payload);
  }

  @GrpcMethod(USER_SERVICE_NAME, 'FindByPhone')
  private async findByPhone(payload): Promise<FindOneUserResponse> {
    return this.service.findByPhone(payload);
  }

  @GrpcMethod(USER_SERVICE_NAME, 'FindByEmail')
  private async findByEmail(payload): Promise<FindOneUserResponse> {
    return this.service.findByEmail(payload);
  }

  @GrpcMethod(USER_SERVICE_NAME, 'FindByInn')
  private async findByInn(payload): Promise<FindOneUserResponse> {
    return this.service.findByInn(payload);
  }
}
