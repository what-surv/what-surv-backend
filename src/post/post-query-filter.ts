import { Gender } from 'src/post/gender/gender';

export interface PostQueryFilter {
  sort?: string;
  gender?: Gender;
  age?: string;
  researchType?: string;
  procedure?: string;
}
