import { Module } from '@nestjs/common';
import { MedidorService } from './medidor.service';
import { MedidorController } from './medidor.controller';
import {MongooseModule} from "@nestjs/mongoose";
import {Medidor, MedidorSchema} from "./medidor.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Medidor.name, schema: MedidorSchema },
    ]),
  ],
  providers: [MedidorService],
  controllers: [MedidorController]
})
export class MedidorModule {}
