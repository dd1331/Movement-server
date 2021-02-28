import { PartialType } from '@nestjs/mapped-types';
import { CreateWingmanDto } from './create-wingman.dto';

export class UpdateWingmanDto extends PartialType(CreateWingmanDto) {}
