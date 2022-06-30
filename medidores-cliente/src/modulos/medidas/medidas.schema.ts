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

  @Prop({
    required: true,
  })
  vL1: number;

  @Prop({
    required: true,
  })
  vL2: number;

  @Prop({
    required: true,
  })
  aL1: number;

  @Prop({
    required: true,
  })
  aL2: number;
}

export const Medidas = SchemaFactory.createForClass(MedidasSchema);
