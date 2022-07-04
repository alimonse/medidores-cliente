import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Medidas extends Document {
  @Prop()
  fecha: string;

  @Prop()
  medida: number;

  @Prop()
  vL1: number;

  @Prop()
  vL2: number;

  @Prop()
  aL1: number;

  @Prop()
  aL2: number;
}

export const MedidasSchema = SchemaFactory.createForClass(Medidas);
