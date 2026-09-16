import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { BeanType, Process, RoastLevel } from '../../generated/prisma/enums.js';

/** Filtros da vitrine do agregador (query string da listagem de cafés). */
export class QueryCoffeesDto {
  @ApiPropertyOptional({ description: 'Busca livre por nome, descrição ou origem' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ enum: BeanType })
  @IsOptional()
  @IsEnum(BeanType)
  beanType?: BeanType;

  @ApiPropertyOptional({ enum: RoastLevel })
  @IsOptional()
  @IsEnum(RoastLevel)
  roastLevel?: RoastLevel;

  @ApiPropertyOptional({ enum: Process })
  @IsOptional()
  @IsEnum(Process)
  process?: Process;

  @ApiPropertyOptional({ description: 'Slug da torrefação' })
  @IsOptional()
  @IsString()
  roaster?: string;

  @ApiPropertyOptional({ description: 'Slug do método de preparo' })
  @IsOptional()
  @IsString()
  brewMethod?: string;

  @ApiPropertyOptional({ description: 'Slug da nota sensorial' })
  @IsOptional()
  @IsString()
  flavorNote?: string;

  @ApiPropertyOptional({ description: 'Preço mínimo em centavos' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  minPrice?: number;

  @ApiPropertyOptional({ description: 'Preço máximo em centavos' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  maxPrice?: number;

  @ApiPropertyOptional({ enum: ['recentes', 'preco-asc', 'preco-desc', 'nota'], default: 'recentes' })
  @IsOptional()
  @IsString()
  sort?: 'recentes' | 'preco-asc' | 'preco-desc' | 'nota';

  @ApiPropertyOptional({ default: true, description: 'false inclui anúncios inativos (uso administrativo)' })
  @IsOptional()
  @Transform(({ value }) => value === true || value === 'true')
  @IsBoolean()
  onlyActive?: boolean;

  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({ default: 12 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  perPage?: number;
}
