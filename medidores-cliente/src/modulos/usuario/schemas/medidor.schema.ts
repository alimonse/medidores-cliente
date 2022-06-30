import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {Document, Types} from 'mongoose';
import {Medidas, MedidasSchema} from "./medidas.schema";

@Schema()
export class Medidor extends Document {
  @Prop({
    required: true,
  })
  numMedidor: string;

  @Prop({
    required: true,
  })
  estado: 1 | 0;
  
  @Prop({
    type: [MedidasSchema],
    required: true
  })
  medidas: Types.Array<Medidas>
}



export const MedidorSchema = SchemaFactory.createForClass(Medidor)
