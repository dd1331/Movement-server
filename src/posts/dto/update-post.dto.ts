import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdatePostDto {
  @IsNotEmpty()
  title: string;
  @IsNotEmpty()
  content: string;
  @IsNumber()
  postId: number;
}
