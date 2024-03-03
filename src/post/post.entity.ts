import { CommonEntity } from 'src/common/common.entity';
import { Like } from 'src/like/entities/like.entity';
import { Gender, Genders } from 'src/post/gender';
import { User } from 'src/user/user.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

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

  @Column({ type: 'varchar', length: 255 })
  researchType!: string;

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

  /**
   * 좋아요 누른 글 다대다 관계로 인해 post에서
   * 역참조 할 수 있도록 일대다 관계 명시했습니다.
   */
  @OneToMany(() => Like, (like) => like.post)
  likes!: Like[];
}
