import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entity/user.entity';
import { Repository } from 'typeorm';

export class UserRepository {
  @InjectRepository(User)
  private readonly userRepository: Repository<User>;

  public async findAllUsers(): Promise<User[]> {
    return await this.userRepository.find({
      relations: {
        login: true,
        info: true,
      },
    });
  }

  public async findUserById(uuid: string): Promise<User> {
    return await this.userRepository.findOne({
      where: { uuid: uuid },
      relations: {
        login: true,
        info: true,
      },
    });
  }

  public async saveUser(user: User): Promise<User> {
    return await this.userRepository.save(user);
  }
}
