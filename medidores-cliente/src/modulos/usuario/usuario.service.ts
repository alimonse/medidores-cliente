import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Usuario } from './usuario.schema';
import { CreateUserDto, UsuarioPassDto } from './dto/usuario.create.dto';
import { ApiMedidoresService } from '../servicios-externos/api-medidores.service';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectModel(Usuario.name)
    private readonly _usuarioModel: Model<Usuario>,
    private readonly _apiMedidoresService: ApiMedidoresService,
  ) {}

  async crear(datosUsuario: CreateUserDto, numMedidor: string) {
    //* consultar info medidor
    const medidorInfo = await this._apiMedidoresService.obtenerInfo(numMedidor);

    datosUsuario.medidores = [
      {
        numMedidor: medidorInfo.list[0].deviceId,
        estado: JSON.parse(
          medidorInfo.list[0].data.find((d) => d.dataType === '42460002').value,
        ),
        medidas: [
          {
            fecha: new Date(Date.now()).toISOString(),
            medida: +medidorInfo.list[0].data.find(
              (d) => d.dataType === 'Active energy(+) total',
            ).value,
            aL1: +medidorInfo.list[0].data.find(
              (d) => d.dataType === '02010300',
            ).value,
            aL2: +medidorInfo.list[0].data.find(
              (d) => d.dataType === '02010302',
            ).value,
            vL1: +medidorInfo.list[0].data.find(
              (d) => d.dataType === '02000300',
            ).value,
            vL2: +medidorInfo.list[0].data.find(
              (d) => d.dataType === '02000302',
            ).value,
          },
        ],
      },
    ];

    const nuevoUsuario = new this._usuarioModel(datosUsuario);
    return nuevoUsuario.save();
  }

  obtener() {
    return this._usuarioModel.find().exec();
  }

  async actualizarMedidas(medidor) {
    const medidorResp = await this._usuarioModel
      .findOne({
        "medidores.numMedidor": "22239619",
      })
      .exec();

    console.log(medidorResp);
  }

  async buscarPorUsuarioyContrasena(criterioBusqueda: UsuarioPassDto) {
    try {
      const { cedula, password } = criterioBusqueda;
      const usuarioEncontrado = await this._usuarioModel
        .findOne({ cedula, password })
        .exec();
      console.log(usuarioEncontrado);
      if (!usuarioEncontrado) return null;
      const { medidores } = usuarioEncontrado;
      // Todo: hacer validacion de fecha y update
      // if(medidores[0].medidas[0].fecha == )

      const medidorInfo = await this._apiMedidoresService.obtenerInfo(
        medidores[0].numMedidor,
      );

      const medidor = await this._usuarioModel.findByIdAndUpdate(
        usuarioEncontrado._id,
        {
          $set: {
            'medidores.0.estado': JSON.parse(
              medidorInfo.list[0].data.find((d) => d.dataType === '42460002')
                .value,
            ),
          },
        },
      );

      return {
        ...medidor,
        estado: JSON.parse(
          medidorInfo.list[0].data.find((d) => d.dataType === '42460002').value,
        ),
      };
    } catch (e) {
      return 0;
    }
  }
}
