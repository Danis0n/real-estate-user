import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entity/user.entity';
import { Repository } from 'typeorm';

export class UserRepository {
  @InjectRepository(User)
  private readonly userRepository: Repository<User>;

  public async saveUser(user: User): Promise<User> {
    return await this.userRepository.save(user);
  }

  public async findAllUsers(): Promise<User[]> {
    return await this.userRepository.find({
      relations: {
        login: true,
        info: true,
        roles: true,
        ur: true,
      },
    });
  }

  public async findUserById(uuid: string): Promise<User> {
    return await this.userRepository.findOne({
      where: { uuid: uuid },
      relations: {
        login: true,
        info: true,
        roles: true,
        ur: true,
      },
    });
  }

  public async findUserByLogin(login: string) {
    return await this.userRepository.findOne({
      where: {
        login: {
          login: login,
        },
      },
      relations: {
        login: true,
        info: true,
        roles: true,
        ur: true,
      },
    });
  }

  public async findUserByPhone(phone: string) {
    return await this.userRepository.findOne({
      where: { phone: phone },
      relations: {
        login: true,
        info: true,
        roles: true,
        ur: true,
      },
    });
  }

  public async findUserByInn(inn: string) {
    return await this.userRepository.findOne({
      where: {
        ur: {
          inn: inn,
        },
      },
      relations: {
        login: true,
        info: true,
        roles: true,
        ur: true,
      },
    });
  }

  public async findUserByEmail(email: string) {
    return await this.userRepository.findOne({
      where: { email: email },
      relations: {
        login: true,
        info: true,
        roles: true,
        ur: true,
      },
    });
  }
}
