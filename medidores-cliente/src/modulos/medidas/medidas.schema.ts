import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// @Schema({
//   collection: 'medidas',
//   timestamps: true,
// })
@Schema({
  timestamps: true
})
export class Medidas extends Document {
  @Prop()
  fecha: number;

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
