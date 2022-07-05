import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { CreateUserDto, UsuarioPassDto } from './dto/usuario.create.dto';
import { ApiMedidoresService } from '../servicios-externos/api-medidores.service';

@Controller('usuario')
export class UsuarioController {
  constructor(
    private readonly _usuarioService: UsuarioService,
    private readonly _apiMedidoresService: ApiMedidoresService,
  ) {}

  @Get('medidass/:medidor')
  obtenerMedidas(@Param('medidor') medidor:string){
    return this._usuarioService.consultarMedidasPorMedidor(medidor)
  }

  @Post('consultaU')
  buscarPorUsuarioyContrasena(@Body() usuarioPass: UsuarioPassDto) {
    return this._usuarioService.buscarPorUsuarioyContrasena(usuarioPass);
  }

  @Post('estatus/:medidor')
  obtenerEstatusMedidor(@Param('medidor') medidor: string) {
    return this._apiMedidoresService.obtenerStatus(medidor);
  }

  @Post('create/:numMedidor')
  crear(
    @Param('numMedidor') numMedidor: string,
    @Body() datosCrear: CreateUserDto,
  ) {
    return this._usuarioService.crear(datosCrear, numMedidor);
  }

  @Put('medidor/:numMedidor')
  medidas(@Param('medidor') medidor: string) {
    return this._usuarioService.actualizarMedidas(medidor);
  }

  @Get()
  obtener() {
    return this._usuarioService.obtener();
  }
}
