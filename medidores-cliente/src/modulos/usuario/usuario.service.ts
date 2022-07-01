import { Injectable } from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {Usuario} from "./usuario.schema";
import {CreateUserDto, UsuarioPassDto} from "./dto/usuario.create.dto";
import {ServiciosExternosModule} from "../servicios-externos/servicios-externos.module";
import {ApiMedidoresService} from "../servicios-externos/api-medidores.service";

@Injectable()
export class UsuarioService {

    constructor(
        @InjectModel(Usuario.name)
        private readonly _usuarioModel: Model<Usuario>,
        private readonly _serviciosExternos: ApiMedidoresService
    ) {

    }

    crear(datosUsuario: CreateUserDto){
        const nuevoUsuario = new this._usuarioModel(datosUsuario);
        return nuevoUsuario.save();
    }

    obtener(){
        return this._usuarioModel.find().exec();
    }

    async buscarPorUsuarioyContrasena(criterioBusqueda: UsuarioPassDto){
        try {
            this._serviciosExternos.authAPI();
            const {cedula,password} = criterioBusqueda;
            return await this._usuarioModel.findOne({cedula,password}).exec()
        } catch (e) {
            return 0;
        }
    }

}

