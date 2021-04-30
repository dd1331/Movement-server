import { Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { UsersService } from '../users/users.service';
import axios, { AxiosResponse } from 'axios';
import { PassThrough } from 'stream';

@Injectable()
export class AwsService {
  constructor(private usersService: UsersService) {}
  create(createAwDto) {
    return 'This action adds a new aw';
  }

  findAll() {
    return `This action returns all aws`;
  }

  findOne(id: number) {
    return `This action returns a #${id} aw`;
  }

  update(id: number, updateAwDto) {
    return `This action updates a #${id} aw`;
  }

  remove(id: number) {
    return `This action removes a #${id} aw`;
  }
}
