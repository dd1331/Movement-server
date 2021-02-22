import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AwsService } from './aws.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('aws')
export class AwsController {
  constructor(private readonly awsService: AwsService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(
    // @Body() body: CreateFileDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    console.log(file.buffer.toString());
    // return this.awsService.upload(file);
  }

  @Get()
  findAll() {
    return this.awsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.awsService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateAwDto) {
    return this.awsService.update(+id, updateAwDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.awsService.remove(+id);
  }
}
