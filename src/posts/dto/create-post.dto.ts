import { IsNotEmpty, IsInt, IsOptional } from 'class-validator';
import { UpdateFileDto } from '../../files/dto/update-file.dto';

export class CreatePostDto {
  @IsInt()
  poster: number;

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
}
