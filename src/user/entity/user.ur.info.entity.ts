import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('app_ur_info_user')
export class UserUrInfo extends BaseEntity {
  @PrimaryGeneratedColumn('increment', { name: 'ur_id' })
  public id!: number;

  @Column({ name: 'description', nullable: true })
  public description!: string;

  @Column({ name: 'link', nullable: false })
  public link!: string;

  @Column({ name: 'inn', nullable: false })
  public inn: string;

  @Column({ name: 'address', nullable: true })
  public address: string;
}
