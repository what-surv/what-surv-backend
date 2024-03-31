import { CommonEntity } from 'src/common/common.entity';
import { Like } from 'src/like/entities/like.entity';
import { Gender, Genders } from 'src/post/gender/gender';
import { User } from 'src/user/user.entity';
import { Comment } from 'src/comment/entities/comment.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { ResearchType } from 'src/research-types/entities/research-type.entity';

@Entity()
export class Post extends CommonEntity {
  @Column({ type: 'varchar', length: 255 })
  title!: string;

  @Column({ type: 'timestamp' })
  endDate!: Date;

  @Column({ type: 'enum', enum: Genders })
  gender!: Gender;

  @Column('simple-array')
  ages!: string[];

  @ManyToMany(() => ResearchType, (researchType) => researchType.posts)
  @JoinTable()
  researchTypes!: ResearchType[];

  @Column({ type: 'varchar', length: 255 })
  url!: string;

  @Column({ type: 'text' })
  procedure!: string;

  @Column({ type: 'varchar', length: 255 })
  duration!: string;

  @Column({ type: 'text' })
  content!: string;

  @Column({ type: 'int', default: 0 })
  viewCount!: number;

  @ManyToOne(() => User)
  author!: User;

  @OneToMany(() => Comment, (comment) => comment.post)
  comments!: Comment[];

  @OneToMany(() => Like, (like) => like.post)
  likes!: Like[];
}
