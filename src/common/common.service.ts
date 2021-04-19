import { Injectable } from '@nestjs/common';
import { CreateCommonDto } from './dto/create-common.dto';
import { UpdateCommonDto } from './dto/update-common.dto';
import { Category } from './entities/category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CommonService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
  ) {}
  create(createCommonDto: CreateCommonDto) {
    return 'This action adds a new common';
  }

  async getCategories(type): Promise<Partial<Category>[]> {
    const temp = [
      { title: 'free' },
      { title: 'exercise' },
      { title: 'environment' },
      { title: 'news' },
      { title: 'meetup' },
    ];
    return temp;
    // return await this.categoryRepo.find({ where: { type } });
  }

  findOne(id: number) {
    return `This action returns a #${id} common`;
  }

  update(id: number, updateCommonDto: UpdateCommonDto) {
    return `This action updates a #${id} common`;
  }

  remove(id: number) {
    return `This action removes a #${id} common`;
  }
}
