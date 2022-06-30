import { Injectable } from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {Usuario} from "./schemas/usuario.schema";
import {CreateUserDto} from "./dto/usuario.create.dto";

@Injectable()
export class UsuarioService {

    constructor(
        @InjectModel(Usuario.name)
        private readonly _usuarioModel: Model<Usuario>
    ) {

    }

    crear(datosUsuario: CreateUserDto){
        const nuevoUsuario = new this._usuarioModel(datosUsuario);
        return nuevoUsuario.save();
    }

    obtener(){
        return this._usuarioModel.find().exec();
    }

}
