import { CommonEntity } from 'src/common/common.entity';
import { Like } from 'src/like/entities/like.entity';
import { User } from 'src/user/user.entity';
import { Comment } from 'src/comment/entities/comment.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { IsUrl } from 'class-validator';
import { ResearchTypeEnum } from 'src/research-types/enums/research-type.enum';
import { AgeEnum } from 'src/ages/enums/age.enum';
import { Gender } from 'src/post/gender/gender';

@Entity()
export class Post extends CommonEntity {
  @Column({ type: 'varchar', length: 255 })
  title!: string;

  @Column({ type: 'timestamp' })
  endDate!: Date;

  @Column({ type: 'enum', enum: Gender })
  gender!: Gender;

  @Column({
    type: 'enum',
    enum: AgeEnum,
    array: true,
    default: [],
  })
  ages!: AgeEnum[];

  @Column({
    type: 'enum',
    enum: ResearchTypeEnum,
    array: true,
    default: [],
  })
  researchTypes!: ResearchTypeEnum[];

  @Column({ type: 'varchar', length: 255, nullable: true })
  @IsUrl()
  url?: string;

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

  commentCount?: number;

  likeCount?: number;
}
