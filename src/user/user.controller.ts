import { Controller, Inject } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import {
  CreateUserResponse,
  FindAllUsersResponse,
  FindOneUserResponse,
  USER_SERVICE_NAME,
} from './user.pb';
import { UserService } from './user.service';
import { CreateUserRequestDto, FindOneDto } from './user.dto';

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

  @GrpcMethod(USER_SERVICE_NAME, 'FindOne')
  private async findById(payload: FindOneDto): Promise<FindOneUserResponse> {
    return this.service.findById(payload);
  }
}
