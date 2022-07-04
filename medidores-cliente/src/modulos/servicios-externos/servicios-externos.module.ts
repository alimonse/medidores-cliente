import { Module } from '@nestjs/common';
import { ApiMedidoresService } from './api-medidores.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [ApiMedidoresService],
  exports: [ApiMedidoresService],
})
export class ServiciosExternosModule {}
