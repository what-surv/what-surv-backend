import { CommonEntity } from 'src/common/common.entity';
import { Column, Entity, ManyToMany } from 'typeorm';
import { Post } from 'src/post/post.entity';

@Entity()
export class ResearchType extends CommonEntity {
  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @ManyToMany(() => Post, (post) => post.researchTypes)
  posts!: Post[];
}
