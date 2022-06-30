import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class MedidasSchema extends Document {
  @Prop({
    required: true,
  })
  fecha: string;

  @Prop({
    required: true,
  })
  medida: number;
}

export const Medidas = SchemaFactory.createForClass(MedidasSchema)