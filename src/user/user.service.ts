import { Inject, Injectable } from '@nestjs/common';
import { CreateUserRequestDto, FindOneDto } from './dto/user.dto';
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

@Injectable()
export class UserService {
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

  public async createUser(dto: CreateUserRequestDto) {
    let user: User = this.userMapper.mapToUserCreate(dto);
    const role: Role = await this.roleRepository.findByName('user');
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
}
