import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
} from '@nestjs/common';
import { WingmanService } from './wingman.service';
import { CreateWingmanDto } from './dto/create-wingman.dto';
import { UpdateWingmanDto } from './dto/update-wingman.dto';

@Controller('wingman')
export class WingmanController {
  constructor(private readonly wingmanService: WingmanService) {}

  @Post()
  create(@Body() createWingmanDto: CreateWingmanDto) {
    return this.wingmanService.create(createWingmanDto);
  }

  @Get()
  crawlInstizFreeBoard() {
    return this.wingmanService.crawlInstizFreeBoard();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.wingmanService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateWingmanDto: UpdateWingmanDto) {
    return this.wingmanService.update(+id, updateWingmanDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.wingmanService.remove(+id);
  }
}
