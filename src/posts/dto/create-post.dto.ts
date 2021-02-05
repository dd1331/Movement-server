import { IsNotEmpty, IsInt } from 'class-validator';

export class CreatePostDto {
  @IsInt()
  poster: number;
  @IsNotEmpty()
  title: string;
  @IsNotEmpty()
  content: string;
}
