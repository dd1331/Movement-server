import {
  IsNotEmpty,
  IsInt,
  IsOptional,
  IsArray,
  IsNumberString,
  IsString,
} from 'class-validator';
import { UpdateFileDto } from '../../files/dto/update-file.dto';

export class CreatePostDto {
  // @IsInt()
  @IsString()
  poster: string;

  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  content: string;

  @IsNotEmpty()
  category: string;

  @IsOptional()
  url?: string;

  @IsOptional()
  fileId?: string;

  @IsOptional()
  @IsArray()
  hashtags?: string[];
}
