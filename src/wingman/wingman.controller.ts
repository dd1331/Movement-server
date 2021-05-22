import { Controller } from '@nestjs/common';
import { WingmanService } from './wingman.service';

@Controller('wingman')
export class WingmanController {
  constructor(private readonly wingmanService: WingmanService) {}
}
