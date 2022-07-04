import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Medidas, MedidasSchema } from '../medidas/medidas.schema';

@Schema()
export class Medidor extends Document {
  @Prop({
    required: true,
  })
  numMedidor: string;

  @Prop({
    required: true,
  })
  estado: boolean;

  @Prop({
    type: [MedidasSchema],
  })
  medidas?: Types.Array<Medidas>;
}

export const MedidorSchema = SchemaFactory.createForClass(Medidor);
