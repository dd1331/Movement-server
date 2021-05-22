import { IsNotEmpty, IsOptional, IsArray, IsString } from 'class-validator';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
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
