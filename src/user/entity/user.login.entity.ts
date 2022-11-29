import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('app_login_user')
export class UserLogin extends BaseEntity {
  @PrimaryGeneratedColumn('increment', { type: 'integer', name: 'login_id' })
  public id!: number;

  @Column({
    type: 'varchar',
    unique: true,
    nullable: false,
    name: 'login_name',
  })
  public login!: string;

  @Column({ type: 'varchar', nullable: false, name: 'login_password' })
  public password!: string;
}
