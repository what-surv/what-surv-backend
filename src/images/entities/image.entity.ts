import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { CommonEntity } from 'src/common/common.entity';

@Entity()
export class Image extends CommonEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  originalName!: string;

  @Column()
  url!: string;
}
