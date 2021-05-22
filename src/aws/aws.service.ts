import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Injectable()
export class AwsService {
  constructor(private usersService: UsersService) {}
}
