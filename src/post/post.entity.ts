import { CommonEntity } from 'src/common/common.entity';
import { Gender, genderEnum } from 'src/post/gender';
import { User } from 'src/user/user.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity()
export class Post extends CommonEntity {
  @Column({ type: 'varchar', length: 255 })
  title!: string;

  @Column({ type: 'timestamp' })
  endDate!: Date;

  @Column({ type: 'enum', enum: genderEnum })
  gender!: Gender;

  @Column('simple-array')
  ages!: string[];

  @Column({ type: 'varchar', length: 255 })
  researchType!: string;

  @Column({ type: 'varchar', length: 255 })
  url!: string;

  @Column({ type: 'text' })
  procedure!: string;

  @Column({ type: 'varchar', length: 255 })
  time!: string;

  @Column({ type: 'text' })
  content!: string;

  @ManyToOne(() => User)
  author!: User;
}
