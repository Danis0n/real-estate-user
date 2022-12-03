import {
  BaseEntity,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('role')
export class Role extends BaseEntity {
  @PrimaryGeneratedColumn('increment', { name: 'role_id' })
  public id!: number;

  @Column({ name: 'role_name' })
  public name!: string;

  @ManyToMany(() => User, (user) => user.roles)
  public users!: User[];
}
