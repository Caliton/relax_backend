import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { Period } from './period.entity';
import { PeriodService } from './period.service';

@Controller('periodstatus')
export class PeriodController {
  constructor(private readonly periodstatusService: PeriodService) {}
}
