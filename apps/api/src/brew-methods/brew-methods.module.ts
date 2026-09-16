import { Module } from '@nestjs/common';
import { BrewMethodsController } from './brew-methods.controller.js';
import { BrewMethodsService } from './brew-methods.service.js';

@Module({
  controllers: [BrewMethodsController],
  providers: [BrewMethodsService],
})
export class BrewMethodsModule {}
