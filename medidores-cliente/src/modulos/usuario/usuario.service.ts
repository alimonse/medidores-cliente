import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Schema, Types } from 'mongoose';
import { Usuario } from './usuario.schema';
import { CreateUserDto, UsuarioPassDto } from './dto/usuario.create.dto';
import { ApiMedidoresService } from '../servicios-externos/api-medidores.service';
import * as moment from 'moment-timezone';
import { Medidor } from '../medidor/medidor.schema';
// eslint-disable-next-line @typescript-eslint/no-var-requires
import { Logger, ObjectId } from 'mongodb';
import { Medidas } from '../medidas/medidas.schema';

const DEFAULT_TIME_ZONE = 'America/Guayaquil';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectModel(Usuario.name)
    private readonly _usuarioModel: Model<Usuario>,
    private readonly _apiMedidoresService: ApiMedidoresService,

    @InjectModel(Medidor.name)
    private readonly _medidorModel: Model<Medidor>,

    @InjectModel(Medidas.name)
    private readonly _medidasModel: Model<Medidas>,
  ) {}

  async crear(datosUsuario: CreateUserDto, numMedidor: string) {
    const nuevoMedidor = await this._medidorModel.create({
      numMedidor: numMedidor,
    });

    datosUsuario.medidores = [nuevoMedidor._id];

    const nuevoUsuario = new this._usuarioModel(datosUsuario);
    return nuevoUsuario.save();
  }

  async consultarMedidasPorMedidor(numMedidor, idUsuario) {
    // * consultar info numMedidor
    const medidorInfo = await this._apiMedidoresService.obtenerInfo(numMedidor);

    const medidasActualizar = await this._medidorModel.aggregate([
      {
        $lookup: {
          from: 'usuarios',
          localField: '_id',
          foreignField: 'medidores',
          as: 'usuario',
        },
      },
      {
        $unwind: {
          path: '$usuario',
          preserveNullAndEmptyArrays: false,
        },
      },

      {
        $match: {
          $and: [
            {
              numMedidor: numMedidor,
            },
            {
              'usuario._id': new ObjectId(idUsuario),
            },
          ],
        },
      },
      {
        $lookup: {
          from: 'medidas',
          localField: 'medidas',
          foreignField: '_id',
          as: 'medidas',
        },
      },
      {
        $unwind: {
          path: '$medidas',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $sort: {
          'medidas._id': -1,
        },
      },
      {
        $group: {
          _id: {
            _id: '$_id',
          },
          medidas: {
            $push: '$medidas',
          },
        },
      },
      {
        $addFields: {
          _id: '$_id._id',
          medidas: '$medidas',
        },
      },
    ]);

    const ultimaMedida = medidasActualizar[0].medidas.length
      ? medidasActualizar[0].medidas[0]
      : [];

    const finDia = moment.tz(DEFAULT_TIME_ZONE).endOf('day').valueOf();

    const inicioDia = moment.tz(DEFAULT_TIME_ZONE).startOf('day').valueOf();

    const updateMedidas =
      ultimaMedida?.fecha < finDia && ultimaMedida?.fecha > inicioDia;

    const medidasCreate = {
      fecha: moment.tz(DEFAULT_TIME_ZONE).valueOf(),
      medida: +medidorInfo.list[0].data.find(
        (d) => d.dataType === 'Active energy(+) total',
      ).value,
      aL1: +medidorInfo.list[0].data.find((d) => d.dataType === '02010300')
        .value,
      aL2: +medidorInfo.list[0].data.find((d) => d.dataType === '02010302')
        .value,
      vL1: +medidorInfo.list[0].data.find((d) => d.dataType === '02000300')
        .value,
      vL2: +medidorInfo.list[0].data.find((d) => d.dataType === '02000302')
        .value,
    };

    if (updateMedidas) {
      this._medidasModel.updateOne(
        new ObjectId(ultimaMedida._id),
        medidasCreate,
      );
    } else {
      const medidasAcrear = await this._medidasModel.create(medidasCreate);

      await this._medidorModel.updateOne(
        { _id: medidasActualizar[0]._id },
        { $push: { medidas: [medidasAcrear._id] as any } },
      );
    }

    return medidasActualizar;
  }

  obtener() {
    return this._usuarioModel.find().exec();
  }

  async actualizarMedidas(medidor) {
    const medidorResp = await this._usuarioModel
      .findOne({
        'medidores.numMedidor': '22239619',
      })
      .exec();
  }

  async buscarPorUsuarioyContrasena(criterioBusqueda: UsuarioPassDto) {
    try {
      const { cedula, password } = criterioBusqueda;
      const usuarioEncontrado = await this._usuarioModel
        .findOne({ cedula, password })
        .exec();

      if (!usuarioEncontrado) return false;
      return true;
    } catch (e) {
      console.log(e);
      return 0;
    }
  }
}
