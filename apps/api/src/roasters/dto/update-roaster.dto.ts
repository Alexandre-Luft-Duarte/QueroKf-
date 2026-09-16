import { PartialType } from '@nestjs/swagger';
import { CreateRoasterDto } from './create-roaster.dto.js';

export class UpdateRoasterDto extends PartialType(CreateRoasterDto) {}
