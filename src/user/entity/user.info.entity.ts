import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('app_info_user')
export class UserInfo extends BaseEntity {
  @PrimaryGeneratedColumn('increment', { name: 'info_id' })
  public id!: number;

  @Column({ name: 'first_name' })
  public firstName!: string;

  @Column({ name: 'last_name' })
  public lastName!: string;

  @Column({ name: 'birth' })
  public birthData: string;

  @Column({ name: 'description' })
  public description: string;
}
