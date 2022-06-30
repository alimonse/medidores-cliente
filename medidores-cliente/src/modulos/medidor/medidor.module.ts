import { Module } from '@nestjs/common';
import { MedidorService } from './medidor.service';
import { MedidorController } from './medidor.controller';

@Module({
  providers: [MedidorService],
  controllers: [MedidorController]
})
export class MedidorModule {}
