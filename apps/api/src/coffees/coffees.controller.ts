import { Body, Controller, Delete, Get, HttpCode, Param, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CoffeesService } from './coffees.service.js';
import { CreateCoffeeDto } from './dto/create-coffee.dto.js';
import { UpdateCoffeeDto } from './dto/update-coffee.dto.js';
import { QueryCoffeesDto } from './dto/query-coffees.dto.js';

@ApiTags('coffees')
@Controller('coffees')
export class CoffeesController {
  constructor(private readonly coffeesService: CoffeesService) {}

  @Post()
  @ApiOperation({ summary: 'Cadastra um café de uma torrefação parceira' })
  create(@Body() dto: CreateCoffeeDto) {
    return this.coffeesService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Lista cafés com filtros de descoberta e paginação' })
  findAll(@Query() query: QueryCoffeesDto) {
    return this.coffeesService.findAll(query);
  }

  @Get(':idOrSlug')
  @ApiOperation({ summary: 'Detalha um café por id ou slug' })
  findOne(@Param('idOrSlug') idOrSlug: string) {
    return this.coffeesService.findOne(idOrSlug);
  }

  @Post(':idOrSlug/redirect')
  @HttpCode(200)
  @ApiOperation({ summary: 'Contabiliza o clique e devolve a URL da loja parceira' })
  redirect(@Param('idOrSlug') idOrSlug: string) {
    return this.coffeesService.registerRedirect(idOrSlug);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualiza um café' })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateCoffeeDto) {
    return this.coffeesService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(200)
  @ApiOperation({ summary: 'Remove um café do catálogo' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.coffeesService.remove(id);
  }
}
