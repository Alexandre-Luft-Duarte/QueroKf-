import { Body, Controller, Delete, Get, HttpCode, Param, ParseUUIDPipe, Patch, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { BrewMethodsService } from './brew-methods.service.js';
import { CreateBrewMethodDto } from './dto/create-brew-method.dto.js';
import { UpdateBrewMethodDto } from './dto/update-brew-method.dto.js';

@ApiTags('brew-methods')
@Controller('brew-methods')
export class BrewMethodsController {
  constructor(private readonly brewMethodsService: BrewMethodsService) {}

  @Post()
  @ApiOperation({ summary: 'Cria um método de preparo' })
  create(@Body() dto: CreateBrewMethodDto) {
    return this.brewMethodsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Lista os métodos de preparo disponíveis como filtro' })
  findAll() {
    return this.brewMethodsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Detalha um método de preparo e os cafés associados' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.brewMethodsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualiza um método de preparo' })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateBrewMethodDto) {
    return this.brewMethodsService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(200)
  @ApiOperation({ summary: 'Remove um método de preparo' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.brewMethodsService.remove(id);
  }
}
