import { User } from './entities/user.entity';

export type BulkedUser = Partial<User> & { accessToken: string };

export type Profile = Partial<User> & {
  postSum: number;
  commentSum: number;
  likeSum: number;
  avatar: string;
};
