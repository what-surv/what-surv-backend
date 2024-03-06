import { Post } from 'src/post/post.entity';
import { User } from 'src/user/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  content!: string;

  @ManyToOne(() => Post, (post) => post.comments)
  post!: Post;

  @ManyToOne(() => Comment, { nullable: true })
  parent!: Comment;

  @ManyToOne(() => User)
  user!: User;
}
