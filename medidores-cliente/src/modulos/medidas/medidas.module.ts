import { Module } from '@nestjs/common';
import { MedidasService } from './medidas.service';
import { MedidasController } from './medidas.controller';
import {MongooseModule} from "@nestjs/mongoose";
import {Medidas, MedidasSchema} from "./medidas.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Medidas.name, schema: MedidasSchema },
    ]),
  ],
  providers: [MedidasService],
  controllers: [MedidasController]
})
export class MedidasModule {}
