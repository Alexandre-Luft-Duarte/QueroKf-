import { Body, Controller, Delete, Get, HttpCode, Param, ParseUUIDPipe, Patch, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { FlavorNotesService } from './flavor-notes.service.js';
import { CreateFlavorNoteDto } from './dto/create-flavor-note.dto.js';
import { UpdateFlavorNoteDto } from './dto/update-flavor-note.dto.js';

@ApiTags('flavor-notes')
@Controller('flavor-notes')
export class FlavorNotesController {
  constructor(private readonly flavorNotesService: FlavorNotesService) {}

  @Post()
  @ApiOperation({ summary: 'Cria uma nota sensorial' })
  create(@Body() dto: CreateFlavorNoteDto) {
    return this.flavorNotesService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Lista as notas sensoriais disponíveis como filtro' })
  findAll() {
    return this.flavorNotesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Detalha uma nota sensorial e os cafés associados' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.flavorNotesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Renomeia uma nota sensorial' })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateFlavorNoteDto) {
    return this.flavorNotesService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(200)
  @ApiOperation({ summary: 'Remove uma nota sensorial' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.flavorNotesService.remove(id);
  }
}
