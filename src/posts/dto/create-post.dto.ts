import { IsNotEmpty, IsInt } from 'class-validator';

export class CreatePostDto {
  @IsNotEmpty()
  title: string;
  @IsNotEmpty()
  content: string;
  @IsInt()
  poster: number;
}
