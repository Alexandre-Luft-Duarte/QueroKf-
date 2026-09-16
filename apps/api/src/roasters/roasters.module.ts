import { Module } from '@nestjs/common';
import { RoastersController } from './roasters.controller.js';
import { RoastersService } from './roasters.service.js';

@Module({
  controllers: [RoastersController],
  providers: [RoastersService],
})
export class RoastersModule {}
