export class CreateUserDto {
  userId?: string;
  userName?: string;
  password: string;
  phone: string;
  provider?: string;
  naverId?: string;
}
