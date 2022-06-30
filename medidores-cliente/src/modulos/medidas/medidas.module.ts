import { Module } from '@nestjs/common';
import { MedidasService } from './medidas.service';
import { MedidasController } from './medidas.controller';

@Module({
  providers: [MedidasService],
  controllers: [MedidasController]
})
export class MedidasModule {}
