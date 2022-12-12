import { Controller, Inject } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import {
  CreateRoleResponse,
  CreateUserResponse,
  DeleteImageResponse,
  FindAllUsersResponse,
  FindOneUserResponse,
  GetHashedPasswordResponse,
  UploadImageResponse,
  USER_SERVICE_NAME,
} from './proto/user.pb';
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

  @GrpcMethod(USER_SERVICE_NAME, 'GetHashedPassword')
  private async getHashedPassword(payload): Promise<GetHashedPasswordResponse> {
    return this.service.getHashedPassword(payload);
  }

  @GrpcMethod(USER_SERVICE_NAME, 'UploadImageToUser')
  private async uploadImage(payload): Promise<UploadImageResponse> {
    return this.service.uploadImage(payload);
  }

  @GrpcMethod(USER_SERVICE_NAME, 'DeleteImageFromUser')
  private async deleteImage(payload): Promise<DeleteImageResponse> {
    return this.service.deleteImage(payload);
  }
}
