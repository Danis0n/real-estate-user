import { HttpStatus, Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { CreateUserRequestDto, FindLoginDto, FindOneDto } from './dto/user.dto';
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
  CheckUserRequest,
  CheckUserResponse,
  ConfirmAccountRequest,
  ConfirmAccountResponse,
  CreateRoleResponse,
  CreateUserResponse,
  DeleteImageRequest,
  DeleteImageResponse,
  FindAllUsersResponse,
  FindOneUserResponse,
  GetHashedPasswordResponse,
  LockStateRequest,
  LockStateResponse,
  UpdateCompanyInfoRequest,
  UpdateCompanyInfoResponse,
  UpdateInfoRequest,
  UpdateInfoResponse,
  UpdatePasswordRequest,
  UpdatePasswordResponse,
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

  public async createUser(
    dto: CreateUserRequestDto,
  ): Promise<CreateUserResponse> {
    let user: User = this.userMapper.mapToUserCreate(dto);

    const role: Role = await this.roleRepository.findByName(dto.role);

    user.roles = [role];
    user = await this.userRepository.save(user);

    if (!user) return { status: HttpStatus.BAD_REQUEST, user: null };

    return {
      status: HttpStatus.OK,
      user: this.userMapper.mapToUserDto(user),
    };
  }

  public async findAll(): Promise<FindAllUsersResponse> {
    const users: User[] = await this.userRepository.findAll();
    return { users: this.userMapper.mapToArrayUserDto(users) };
  }

  public async findById(dto: FindOneDto): Promise<FindOneUserResponse> {
    const user: User = await this.userRepository.findById(dto.id);
    return { user: user != null ? this.userMapper.mapToUserDto(user) : null };
  }

  public async confirm(
    dto: ConfirmAccountRequest,
  ): Promise<ConfirmAccountResponse> {
    await this.userRepository.confirmById(dto.UUID);
    return { error: null, status: HttpStatus.OK };
  }

  public async changePassword(
    dto: UpdatePasswordRequest,
  ): Promise<UpdatePasswordResponse> {
    const user: User = await this.userRepository.findById(dto.UUID);

    if (user == null) {
      return { error: 'Пользователь не найден', status: HttpStatus.NOT_FOUND };
    }

    user.login.password = dto.password;
    await this.userRepository.save(user);

    return { error: null, status: HttpStatus.OK };
  }

  public async createRole(dto: CreateRoleDto): Promise<CreateRoleResponse> {
    let role: Role = this.roleMapper.mapToNewRole(dto.name);
    role = await this.roleRepository.saveRole(role);

    return { status: HttpStatus.OK, role: role };
  }

  public async findByLogin(dto: FindLoginDto): Promise<FindOneUserResponse> {
    const user: User = await this.userRepository.findByLogin(dto.login);
    return { user: this.userMapper.mapToUserDto(user) };
  }

  public async getHashedPassword(
    dto: FindLoginDto,
  ): Promise<GetHashedPasswordResponse> {
    const user: User = await this.userRepository.findHashedPassword(dto.login);
    return { password: user.login.password };
  }

  public async uploadImage(
    dto: UploadImageRequest,
  ): Promise<UploadImageResponse> {
    await this.deleteUserPrevImage(dto.UUID);

    const image: ImageUserResponse = await firstValueFrom(
      this.imageSvc.imageUploadUser(dto),
    );

    await this.userRepository.setImage(image.UUID, dto.UUID);
    return { status: HttpStatus.OK, error: null, UUID: image.UUID };
  }

  public async deleteImage(
    dto: DeleteImageRequest,
  ): Promise<DeleteImageResponse> {
    const user: User = await this.userRepository.findById(dto.UUID);

    if (user.image !== null) {
      await this.userRepository.deleteImage(dto.UUID);
      await firstValueFrom(this.imageSvc.imageDelete({ UUID: user.image }));
    }
    return {
      status: HttpStatus.NOT_FOUND,
      error: 'Пользователь не имеет аватара',
    };
  }

  public async updateInfo(dto: UpdateInfoRequest): Promise<UpdateInfoResponse> {
    const user: User = await this.userRepository.findById(dto.UUID);

    if (user == null)
      return { error: 'Пользователь не найден', status: HttpStatus.NOT_FOUND };

    if (dto.firstName) user.info.firstName = dto.firstName;
    if (dto.lastName) user.info.lastName = dto.lastName;
    if (dto.email) user.email = dto.email;
    if (dto.phone) user.phone = dto.phone;

    await this.userRepository.save(user);
    return { error: null, status: HttpStatus.OK };
  }

  public async updateCompanyInfo(
    dto: UpdateCompanyInfoRequest,
  ): Promise<UpdateCompanyInfoResponse> {
    const user: User = await this.userRepository.findById(dto.UUID);

    if (user == null)
      return { error: 'Пользователь не найден', status: HttpStatus.NOT_FOUND };

    if (dto.description) user.ur.description = dto.description;
    if (dto.link) user.ur.link = dto.link;
    if (dto.address) user.ur.address = dto.address;

    await this.userRepository.save(user);
    return { error: null, status: HttpStatus.OK };
  }

  public async checkUser(dto: CheckUserRequest): Promise<CheckUserResponse> {
    const users: User[] = await this.userRepository.findByCreateParams(dto);

    if (users && users.length >= 1)
      return {
        error: 'Пользователь с данными параметрами уже существует',
        status: HttpStatus.BAD_REQUEST,
      };

    return { error: null, status: HttpStatus.OK };
  }

  private async deleteUserPrevImage(uuid: string) {
    const user: User = await this.userRepository.findById(uuid);

    if (user.image !== null) {
      await firstValueFrom(this.imageSvc.imageDelete({ UUID: user.image }));
    }
  }

  public async updateUserLock(
    dto: LockStateRequest,
  ): Promise<LockStateResponse> {
    const user: User = await this.userRepository.findById(dto.UUID);

    if (user == null)
      return {
        error: 'Пользователь не был найден',
        status: HttpStatus.NOT_FOUND,
      };

    user.info.locked = dto.state;
    await this.userRepository.save(user);

    return { error: null, status: HttpStatus.OK };
  }
}
