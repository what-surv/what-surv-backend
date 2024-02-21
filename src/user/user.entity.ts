import { Role, Roles } from 'src/auth/role/role';
import { CommonEntity } from 'src/common/common.entity';
import { Column, CreateDateColumn, Entity, Index } from 'typeorm';

@Entity()
@Index('idx_provider_providerId', ['provider', 'providerId'], { unique: true })
export class User extends CommonEntity {
  @Column()
  email!: string;

  @Column()
  provider!: string;

  @Column()
  providerId!: string;

  @Column({ default: Roles.User })
  role!: Role;

  @CreateDateColumn({ type: 'timestamp without time zone' })
  createdDate?: Date;

  @Column({ nullable: true })
  nickname?: string;

  @Column({ nullable: true })
  gender?: string;

  @Column({ nullable: true })
  job?: string;

  @Column({ nullable: true })
  birthDate?: Date;
}
