import {Body, Controller, Get, Post} from '@nestjs/common';
import {UsuarioService} from "./usuario.service";
import {CreateUserDto} from "./dto/usuario.create.dto";

@Controller('usuario')
export class UsuarioController {
    constructor(
        private readonly _usuarioService: UsuarioService
    ) {
    }

    @Post()
    crear(@Body()datosCrear: CreateUserDto){
        return this._usuarioService.crear(datosCrear)
    }

    @Get()
    obtener() {
        return this._usuarioService.obtener();
    }
}
