import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('app_login_user')
export class UserLogin extends BaseEntity {
  @PrimaryColumn({ type: 'integer', name: 'login_id', generated: 'increment' })
  public id: number;

  @Column({
    type: 'varchar',
    unique: true,
    nullable: false,
    name: 'login_name',
  })
  public login: string;

  @Column({ type: 'varchar', nullable: false, name: 'login_password' })
  public password: string;
}
