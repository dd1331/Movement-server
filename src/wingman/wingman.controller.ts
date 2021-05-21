import { Controller, Get, Body, Put, Param, Delete } from '@nestjs/common';
import { WingmanService } from './wingman.service';
import { UpdateWingmanDto } from './dto/update-wingman.dto';

@Controller('wingman')
export class WingmanController {
  constructor(private readonly wingmanService: WingmanService) {}
}
