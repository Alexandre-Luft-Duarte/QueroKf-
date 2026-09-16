import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUrl, Length, MaxLength } from 'class-validator';

export class CreateRoasterDto {
  @ApiProperty({ example: 'Torrefação Serra Azul' })
  @IsString()
  @Length(2, 120)
  name: string;

  @ApiPropertyOptional({ example: 'Micro torrefação de cafés especiais da Mantiqueira.' })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @ApiProperty({ example: 'https://serraazulcafe.com.br' })
  @IsUrl({ require_protocol: true })
  websiteUrl: string;

  @ApiPropertyOptional({ example: 'https://serraazulcafe.com.br/logo.png' })
  @IsOptional()
  @IsUrl({ require_protocol: true })
  logoUrl?: string;

  @ApiPropertyOptional({ example: 'Campos do Jordão' })
  @IsOptional()
  @IsString()
  @MaxLength(80)
  city?: string;

  @ApiPropertyOptional({ example: 'SP' })
  @IsOptional()
  @IsString()
  @Length(2, 2)
  state?: string;
}
