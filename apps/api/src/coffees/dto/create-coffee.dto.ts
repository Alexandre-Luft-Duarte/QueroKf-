import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayUnique,
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  IsUrl,
  Length,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { BeanType, Process, RoastLevel } from '../../generated/prisma/enums.js';

export class CreateCoffeeDto {
  @ApiProperty({ example: 'Bourbon Amarelo Natural' })
  @IsString()
  @Length(2, 140)
  name: string;

  @ApiPropertyOptional({ example: 'Doçura intensa, corpo aveludado e final prolongado.' })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;

  @ApiPropertyOptional({ example: 'https://cdn.exemplo.com/bourbon.jpg' })
  @IsOptional()
  @IsUrl({ require_protocol: true })
  imageUrl?: string;

  @ApiProperty({ example: 4990, description: 'Preço em centavos' })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  priceCents: number;

  @ApiProperty({ example: 250, description: 'Peso do pacote em gramas' })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  weightGrams: number;

  @ApiProperty({ enum: BeanType, example: BeanType.ARABICA })
  @IsEnum(BeanType)
  beanType: BeanType;

  @ApiProperty({ enum: RoastLevel, example: RoastLevel.MEDIA })
  @IsEnum(RoastLevel)
  roastLevel: RoastLevel;

  @ApiPropertyOptional({ enum: Process, example: Process.NATURAL })
  @IsOptional()
  @IsEnum(Process)
  process?: Process;

  @ApiProperty({ example: 'Sul de Minas' })
  @IsString()
  @Length(2, 120)
  origin: string;

  @ApiPropertyOptional({ example: 'Carmo de Minas' })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  region?: string;

  @ApiPropertyOptional({ example: 1150, description: 'Altitude do cultivo em metros' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(3000)
  altitude?: number;

  @ApiPropertyOptional({ example: 86, description: 'Pontuação SCA (80 a 100)' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(100)
  scaScore?: number;

  @ApiProperty({ example: 'https://serraazulcafe.com.br/produtos/bourbon-amarelo' })
  @IsUrl({ require_protocol: true })
  storeUrl: string;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  active?: boolean;

  @ApiProperty({ format: 'uuid', description: 'Torrefação dona do anúncio' })
  @IsUUID()
  roasterId: string;

  @ApiPropertyOptional({ type: [String], format: 'uuid', description: 'IDs das notas sensoriais' })
  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsUUID('4', { each: true })
  flavorNoteIds?: string[];

  @ApiPropertyOptional({ type: [String], format: 'uuid', description: 'IDs dos métodos de preparo' })
  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsUUID('4', { each: true })
  brewMethodIds?: string[];
}
