import { Entity, PrimaryGeneratedColumn } from 'typeorm';

export const genderEnum = {
  male: 'Male',
  female: 'Female',
  all: 'All',
} as const;
export type Gender = (typeof genderEnum)[keyof typeof genderEnum];

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id!: number;

  title!: string;

  endDate!: Date;

  gender!: Gender;

  age!: string[];

  researchType!: string;

  link!: string;

  procedure!: string;

  time!: string;

  content!: string;
}
