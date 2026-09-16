import { PartialType } from '@nestjs/swagger';
import { CreateBrewMethodDto } from './create-brew-method.dto.js';

export class UpdateBrewMethodDto extends PartialType(CreateBrewMethodDto) {}
