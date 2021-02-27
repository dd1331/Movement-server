import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class UpdatePostDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  content: string;

  @IsNumber()
  id: number;

  @IsOptional()
  url?: string;

  @IsOptional()
  fileId?: string;
}
