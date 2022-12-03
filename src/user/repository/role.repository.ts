import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../entity/role.entity';

export class RoleRepository {
  @InjectRepository(Role)
  private readonly roleRepository: Repository<Role>;

  public async saveRole(role: Role): Promise<Role> {
    return await this.roleRepository.save(role);
  }

  public async findByName(name: string): Promise<Role> {
    return await this.roleRepository.findOneBy({ name: name });
  }
}
