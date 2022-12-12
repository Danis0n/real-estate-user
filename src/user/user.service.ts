import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import {
  CreateUserRequestDto,
  FindEmailDto,
  FindInnDto,
  FindLoginDto,
  FindOneDto,
  FindPhoneDto,
} from './dto/user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { Repository } from 'typeorm';
import { UserInfo } from './entity/user.info.entity';
import { UserLogin } from './entity/user.login.entity';
import { UserMapper } from './mappers/user.mapper';
import { UserRepository } from './repository/user.repository';
import { CreateRoleDto } from './dto/role.dto';
import { Role } from './entity/role.entity';
import { RoleRepository } from './repository/role.repository';
import { RoleMapper } from './mappers/role.mapper';
import {
  DeleteImageRequest,
  DeleteImageResponse,
  UploadImageRequest,
  UploadImageResponse,
} from './proto/user.pb';
import {
  IMAGE_SERVICE_NAME,
  ImageServiceClient,
  ImageUserResponse,
} from './proto/image.pb';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class UserService implements OnModuleInit {
  private imageSvc: ImageServiceClient;

  @Inject(IMAGE_SERVICE_NAME)
  private readonly client: ClientGrpc;

  @InjectRepository(UserInfo)
  private readonly userInfoRepository: Repository<UserInfo>;

  @InjectRepository(UserLogin)
  private readonly userLoginRepository: Repository<UserLogin>;

  @Inject(UserMapper)
  private readonly userMapper: UserMapper;

  @Inject(RoleMapper)
  private readonly roleMapper: RoleMapper;

  @Inject(UserRepository)
  private readonly userRepository: UserRepository;

  @Inject(RoleRepository)
  private readonly roleRepository: RoleRepository;

  onModuleInit(): void {
    this.imageSvc =
      this.client.getService<ImageServiceClient>(IMAGE_SERVICE_NAME);
  }

  public async createUser(dto: CreateUserRequestDto) {
    let user: User = this.userMapper.mapToUserCreate(dto);
    const role: Role = await this.roleRepository.findByName(
      dto.inn == '' && dto.link == '' ? 'company' : 'user',
    );
    user.roles = [role];
    user = await this.userRepository.saveUser(user);
    return {
      status: '200',
      user: this.userMapper.mapToUserDto(user),
    };
  }

  public async findAll() {
    const users: User[] = await this.userRepository.findAllUsers();
    return { users: this.userMapper.mapArrayUsersDto(users) };
  }

  public async findById(payload: FindOneDto) {
    const user: User = await this.userRepository.findUserById(payload.id);
    return { user: this.userMapper.mapToUserDto(user) };
  }

  public async createRole(payload: CreateRoleDto) {
    let role: Role = this.roleMapper.mapToNewRole(payload.name);
    role = await this.roleRepository.saveRole(role);
    return { status: '200', role: role };
  }

  public async findByLogin(dto: FindLoginDto) {
    const user: User = await this.userRepository.findUserByLogin(dto.login);
    return { user: this.userMapper.mapToUserDto(user) };
  }

  public async findByPhone(dto: FindPhoneDto) {
    const user: User = await this.userRepository.findUserByPhone(dto.phone);
    return { user: this.userMapper.mapToUserDto(user) };
  }

  public async findByEmail(dto: FindEmailDto) {
    const user: User = await this.userRepository.findUserByEmail(dto.email);
    return { user: this.userMapper.mapToUserDto(user) };
  }

  public async findByInn(dto: FindInnDto) {
    const user: User = await this.userRepository.findUserByInn(dto.inn);
    return { user: this.userMapper.mapToUserDto(user) };
  }

  public async getHashedPassword(dto: FindLoginDto) {
    const user: User = await this.userRepository.findHashedPassword(dto.login);
    return { password: user.login.password };
  }

  public async uploadImage(
    dto: UploadImageRequest,
  ): Promise<UploadImageResponse> {
    await this.deleteUserPrevImage(dto.uuid);
    const image: ImageUserResponse = await firstValueFrom(
      this.imageSvc.imageUploadUser(dto),
    );
    await this.userRepository.setImageToUser(image.uuid, dto.uuid);
    return { status: '200', error: null, uuid: image.uuid };
  }

  public async deleteImage(
    dto: DeleteImageRequest,
  ): Promise<DeleteImageResponse> {
    const user: User = await this.userRepository.findUserById(dto.uuid);
    if (user.image !== null) {
      await this.userRepository.deleteImageFromUser(dto.uuid);
      return await firstValueFrom(
        this.imageSvc.imageDelete({ uuid: user.image }),
      );
    }
    return { status: '200', error: 'Пользователь не имеет аватара' };
  }

  private async deleteUserPrevImage(uuid: string) {
    const user: User = await this.userRepository.findUserById(uuid);
    if (user.image !== null) {
      await firstValueFrom(this.imageSvc.imageDelete({ uuid: user.image }));
    }
    return;
  }
}
