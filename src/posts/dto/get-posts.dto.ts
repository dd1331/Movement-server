import { IsOptional, IsString, IsNumberString } from 'class-validator';

export class GetPostsDto {
  @IsOptional()
  @IsString()
  category: string;
  // TODO check if query send values only in string foramt
  @IsOptional()
  @IsNumberString()
  page: number;

  @IsOptional()
  @IsNumberString()
  take: number;
}
