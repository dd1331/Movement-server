import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
} from '@nestjs/common';
import { HashtagsService } from './hashtags.service';
import { CreateHashtagDto } from './dto/create-hashtag.dto';
import { UpdateHashtagDto } from './dto/update-hashtag.dto';

@Controller('hashtags')
export class HashtagsController {
  constructor(private readonly hashtagsService: HashtagsService) {}

  @Post()
  create(@Body() createHashtagDto: CreateHashtagDto) {
    // return this.hashtagsService.create(createHashtagDto);
  }

  @Get('popular')
  getPopularHashtags() {
    return this.hashtagsService.getPopularHashtags();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    // return this.hashtagsService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateHashtagDto: UpdateHashtagDto) {
    // return this.hashtagsService.update(+id, updateHashtagDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    // return this.hashtagsService.remove(+id);
  }
}
