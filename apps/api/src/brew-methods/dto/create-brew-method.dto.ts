import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, Length, MaxLength } from 'class-validator';

export class CreateBrewMethodDto {
  @ApiProperty({ example: 'Hario V60' })
  @IsString()
  @Length(2, 60)
  name: string;

  @ApiPropertyOptional({ example: 'Método filtrado que valoriza acidez e notas florais.' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;
}
