import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Backend Relax de Pé!!! \u{1F601}';
  }
}
