import { Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { UsersService } from '../users/users.service';

@Injectable()
export class AwsService {
  constructor(private usersService: UsersService) {}
  async upload(file) {
    const { originalname } = file;
    const bucketS3 = 'movement-seoul';
    const location = await this.uploadS3(file.buffer, bucketS3, originalname);
    return { location };
  }

  async uploadS3(file, bucket, name) {
    const s3 = this.getS3();
    const params = {
      Bucket: bucket,
      Key: String(name),
      Body: file,
    };
    const res = await s3.upload(params).promise();
    console.log('res', res.Location);
    return res.Location;
  }

  getS3() {
    return new S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: 'ap-northeast-2',
    });
  }
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
