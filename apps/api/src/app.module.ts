import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module.js';
import { HealthModule } from './health/health.module.js';
import { RoastersModule } from './roasters/roasters.module.js';
import { CoffeesModule } from './coffees/coffees.module.js';
import { FlavorNotesModule } from './flavor-notes/flavor-notes.module.js';
import { BrewMethodsModule } from './brew-methods/brew-methods.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    HealthModule,
    RoastersModule,
    CoffeesModule,
    FlavorNotesModule,
    BrewMethodsModule,
  ],
})
export class AppModule {}
