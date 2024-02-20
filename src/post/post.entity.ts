import { CommonEntity } from 'src/common/common.entity';
import { User } from 'src/user/user.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

export const genderEnum = {
  male: 'Male',
  female: 'Female',
  all: 'All',
} as const;
export type Gender = (typeof genderEnum)[keyof typeof genderEnum];

@Entity()
export class Post extends CommonEntity {
  @Column({ type: 'varchar', length: 255 })
  title!: string;

  @Column({ type: 'timestamp' })
  endDate!: Date;

  @Column({ type: 'enum', enum: genderEnum })
  gender!: Gender;

  @Column('simple-array')
  age!: string[];

  @Column({ type: 'varchar', length: 255 })
  researchType!: string;

  @Column({ type: 'varchar', length: 255 })
  link!: string;

  @Column({ type: 'text' })
  procedure!: string;

  @Column({ type: 'varchar', length: 255 })
  time!: string;

  @Column({ type: 'text' })
  content!: string;

  @ManyToOne(() => User)
  author!: User;
}
