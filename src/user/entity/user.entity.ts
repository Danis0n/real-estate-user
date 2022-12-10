import {
  BaseEntity,
  Column,
  Entity,
  OneToOne,
  PrimaryColumn,
  JoinColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { UserLogin } from './user.login.entity';
import { UserInfo } from './user.info.entity';
import { Role } from './role.entity';
import { UserUrInfo } from './user.ur.info.entity';

@Entity('app_user')
export class User extends BaseEntity {
  @PrimaryColumn({ generated: 'uuid', name: 'user_id' })
  public uuid!: string;

  @OneToOne(() => UserLogin, { cascade: true })
  @JoinColumn({ name: 'login_id' })
  public login!: UserLogin;

  @OneToOne(() => UserInfo, { cascade: true })
  @JoinColumn({ name: 'info_id' })
  public info!: UserInfo;

  @OneToOne(() => UserUrInfo, { cascade: true, nullable: true })
  @JoinColumn({ name: 'ur_id' })
  public ur: UserUrInfo;

  @ManyToMany(() => Role, (role) => role.users)
  @JoinTable({
    name: 'app_user_role',
    joinColumn: {
      name: 'user_id',
      referencedColumnName: 'uuid',
    },
    inverseJoinColumn: {
      name: 'role_id',
      referencedColumnName: 'id',
    },
  })
  public roles!: Role[];

  @Column({
    name: 'date_of_creation',
    nullable: false,
    type: 'timestamp',
  })
  public date!: Date;

  @Column({
    name: 'phone',
    nullable: false,
    unique: true,
    type: 'varchar',
  })
  public phone!: string;

  @Column({
    name: 'email',
    nullable: false,
    unique: true,
    type: 'varchar',
  })
  public email!: string;

  @Column({
    name: 'image_id',
    nullable: true,
    unique: true,
    type: 'varchar',
  })
  public image!: string;
}
