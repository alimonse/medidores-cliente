import { Module } from '@nestjs/common';
import { UsuarioController } from './usuario.controller';
import { UsuarioService } from './usuario.service';
import { MongooseModule } from '@nestjs/mongoose';
import {Usuario, UsuarioSchema} from './usuario.schema';
import {ServiciosExternosModule} from "../servicios-externos/servicios-externos.module";
import {Medidor, MedidorSchema} from '../medidor/medidor.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Usuario.name, schema: UsuarioSchema },{ name: Medidor.name, schema: MedidorSchema },
      { name: Usuario.name, schema: UsuarioSchema }
    ]),
      ServiciosExternosModule,
  ],
  providers: [UsuarioService],
  controllers: [UsuarioController],
  exports: [UsuarioService],

})
export class UsuarioModule {}
