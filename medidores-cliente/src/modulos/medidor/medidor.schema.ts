import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';
import { Medidas, MedidasSchema } from '../medidas/medidas.schema';

@Schema({
  collection: 'medidor',
  timestamps: true,
})
export class Medidor extends Document {
  @Prop({
    required: true,
  })
  numMedidor: string;

  @Prop()
  estado: boolean;

  @Prop([
    {
      type: SchemaTypes.ObjectId,
      ref: Medidas.name,
    },
  ])
  medidas?: Types.Array<Medidas>;
}

export const MedidorSchema = SchemaFactory.createForClass(Medidor);
