import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('app_user_info')
export class UserInfo extends BaseEntity {
  @PrimaryColumn({ name: 'info_id', generated: 'increment' })
  public id: number;

  @Column({ name: 'first_name' })
  public firstName: string;

  @Column({ name: 'last_name' })
  public lastName: string;

  @Column({ name: 'date_of_birth' })
  public birthData: Date;

  @Column({ name: 'description' })
  public description: string;
}
