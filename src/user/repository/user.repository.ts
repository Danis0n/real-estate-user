import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entity/user.entity';
import { Repository } from 'typeorm';

export class UserRepository {
  @InjectRepository(User)
  private readonly userRepository: Repository<User>;

  public async saveUser(user: User): Promise<User> {
    return await this.userRepository.save(user);
  }

  public async findAll(): Promise<User[]> {
    return await this.userRepository.find({
      relations: {
        login: true,
        info: true,
        roles: true,
        ur: true,
      },
    });
  }

  public async findById(uuid: string): Promise<User> {
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

  public async findByLogin(login: string): Promise<User> {
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

  public async findByPhone(phone: string): Promise<User> {
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

  public async findByInn(inn: string): Promise<User> {
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

  public async findByEmail(email: string): Promise<User> {
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

  public async findHashedPassword(login: string): Promise<User> {
    return await this.userRepository.findOne({
      where: {
        login: {
          login: login,
        },
      },
      relations: {
        login: true,
      },
    });
  }

  public async deleteImage(uuid: string) {
    return await this.userRepository.update(uuid, { image: null });
  }

  public async setImage(imageUuid: string, userUuid: string) {
    return await this.userRepository.update(userUuid, { image: imageUuid });
  }

  public async confirmById(uuid: string) {
    await this.userRepository.update(uuid, {
      info: {
        enabled: true,
      },
    });
  }
}
