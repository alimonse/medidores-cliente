import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class MedidorSchema extends Document {
  @Prop({
    required: true,
  })
  numMedidor: string;

  @Prop({
    required: true,
  })
  estado: 1 | 0;

}

export const Medidor = SchemaFactory.createForClass(MedidorSchema);
