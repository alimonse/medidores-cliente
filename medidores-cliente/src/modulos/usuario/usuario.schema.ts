import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class UsuarioSchema extends Document {
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
  direccion: string;

  @Prop({
    required: true,
  })
  password: string;
}

export const Usuario = SchemaFactory.createForClass(UsuarioSchema);
