import { User } from './entities/user.entity';

export type BulkedUser = Partial<User> & { accessToken: string };
