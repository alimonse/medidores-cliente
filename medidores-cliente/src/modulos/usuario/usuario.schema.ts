import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Medidor, MedidorSchema } from '../medidor/medidor.schema';

@Schema()
export class Usuario extends Document {
  @Prop({
    required: true,
  })
  nombres: string;

  @Prop({
    required: true,
  })
  apellidos: string;

  @Prop({
    required: true,
  })
  celular: string;

  @Prop({
    required: true,
  })
  correo: string;

  @Prop({
    required: true,
  })
  cedula: string;

  @Prop({
    required: true,
  })
  direccion: string;

  @Prop({
    required: true,
  })
  password: string;

  @Prop({
    required: true,
  })
  terminosCond: boolean;

  @Prop({
    type: [MedidorSchema],
  })
  medidores?: Types.Array<Medidor>;
}

export const UsuarioSchema = SchemaFactory.createForClass(Usuario);
