import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GlobalSettingsController } from './globalSettings.controller';
import { GlobalSettings } from './globalSettings.entity';
import { GlobalSettingsService } from './globalSettings.service';

@Module({
  imports: [TypeOrmModule.forFeature([GlobalSettings])],
  controllers: [GlobalSettingsController],
  providers: [GlobalSettingsService],
  exports: [GlobalSettingsService],
})
export class GlobalSettingsModule {}
