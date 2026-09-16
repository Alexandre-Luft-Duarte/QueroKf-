import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class CreateFlavorNoteDto {
  @ApiProperty({ example: 'Chocolate ao leite' })
  @IsString()
  @Length(2, 60)
  name: string;
}
