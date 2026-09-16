import { Body, Controller, Delete, Get, HttpCode, Param, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { RoastersService } from './roasters.service.js';
import { CreateRoasterDto } from './dto/create-roaster.dto.js';
import { UpdateRoasterDto } from './dto/update-roaster.dto.js';

@ApiTags('roasters')
@Controller('roasters')
export class RoastersController {
  constructor(private readonly roastersService: RoastersService) {}

  @Post()
  @ApiOperation({ summary: 'Cadastra uma torrefação parceira' })
  create(@Body() dto: CreateRoasterDto) {
    return this.roastersService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Lista as torrefações, opcionalmente filtrando por nome' })
  findAll(@Query('search') search?: string) {
    return this.roastersService.findAll(search);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Detalha uma torrefação e seus cafés' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.roastersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualiza os dados de uma torrefação' })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateRoasterDto) {
    return this.roastersService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(200)
  @ApiOperation({ summary: 'Remove uma torrefação e seus cafés' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.roastersService.remove(id);
  }
}
