import { Module } from '@nestjs/common';
import { FlavorNotesController } from './flavor-notes.controller.js';
import { FlavorNotesService } from './flavor-notes.service.js';

@Module({
  controllers: [FlavorNotesController],
  providers: [FlavorNotesService],
})
export class FlavorNotesModule {}
