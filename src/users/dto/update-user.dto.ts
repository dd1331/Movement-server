// import { PartialType } from '@nestjs/swagger';
// import { CreateUserDto } from './create-user.dto';

// export class UpdateUserDto extends PartialType(CreateUserDto) {}
export class UpdateUserDto {
  userName?: string;
  phone?: string;
  password?: string;
  userId?: string;
}
