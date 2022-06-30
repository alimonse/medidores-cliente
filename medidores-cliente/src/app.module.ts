import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import {UsuarioModule} from "./modulos/usuario/usuario.module";
import {MedidorModule} from "./modulos/medidor/medidor.module";
import {MedidasModule} from "./modulos/medidas/medidas.module";

@Module({
  imports: [
    UsuarioModule,
    MedidorModule,
    MedidasModule,
    MongooseModule.forRoot('mongodb+srv://alimonse:12345pass@cluster0.cpagr.mongodb.net/medidores'),

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
