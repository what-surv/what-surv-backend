import { Role } from 'src/auth/role/role';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  email!: string;

  @Column()
  provider!: string;

  @Column()
  providerId!: string;

  @Column({ default: Role.User })
  roles!: Role;

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