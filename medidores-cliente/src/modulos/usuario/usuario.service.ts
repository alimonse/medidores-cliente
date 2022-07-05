import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Schema, Types } from 'mongoose';
import { Usuario } from './usuario.schema';
import { CreateUserDto, UsuarioPassDto } from './dto/usuario.create.dto';
import { ApiMedidoresService } from '../servicios-externos/api-medidores.service';
import * as moment from 'moment-timezone';
import { Medidor } from '../medidor/medidor.schema';
// eslint-disable-next-line @typescript-eslint/no-var-requires
import { ObjectId } from 'mongodb';
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

  // async crear(datosUsuario: CreateUserDto, numMedidor: string) {
  //   //* consultar info medidor
  //   // const medidorInfo = await this._apiMedidoresService.obtenerInfo(numMedidor);
  //
  //   const nuevoMedidor = await this._medidorModel.create({
  //     numMedidor: numMedidor,
  //   });
  //
  //   console.log(nuevoMedidor._id);
  //
  //   datosUsuario.medidores = [nuevoMedidor._id];
  //
  //   // datosUsuario.medidores = [
  //   //   {
  //   //     numMedidor: medidorInfo.list[0].deviceId,
  //   //     estado: JSON.parse(
  //   //       medidorInfo.list[0].data.find((d) => d.dataType === '42460002').value,
  //   //     ),
  //   //     medidas: [
  //   //       {
  //   //         fecha: new Date(Date.now()).toISOString(),
  //   //         medida: +medidorInfo.list[0].data.find(
  //   //           (d) => d.dataType === 'Active energy(+) total',
  //   //         ).value,
  //   //         aL1: +medidorInfo.list[0].data.find(
  //   //           (d) => d.dataType === '02010300',
  //   //         ).value,
  //   //         aL2: +medidorInfo.list[0].data.find(
  //   //           (d) => d.dataType === '02010302',
  //   //         ).value,
  //   //         vL1: +medidorInfo.list[0].data.find(
  //   //           (d) => d.dataType === '02000300',
  //   //         ).value,
  //   //         vL2: +medidorInfo.list[0].data.find(
  //   //           (d) => d.dataType === '02000302',
  //   //         ).value,
  //   //       },
  //   //     ],
  //   //   },
  //   // ];
  //
  //   const nuevoUsuario = new this._usuarioModel(datosUsuario);
  //   return nuevoUsuario.save();
  // }

  async crear(datosUsuario: CreateUserDto, numMedidor: string) {
    const nuevoMedidor = await this._medidorModel.create({
      numMedidor: numMedidor,
    });

    datosUsuario.medidores = [nuevoMedidor._id];

    const nuevoUsuario = new this._usuarioModel(datosUsuario);
    return nuevoUsuario.save();
  }

  async consultarMedidasPorMedidor(numMedidor, idUsuario) {
    console.log(idUsuario);
    console.log(numMedidor);

    const fechaActual = new Date(Date.now()).toISOString();

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

    console.log({
      finDia,
      inicioDia,
      ultimaMedida,
      updateMedidas,
    });

    console.log(updateMedidas, 'boooleaano');

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

      console.log(medidasActualizar, 'medidas');
      const cualquier = await this._medidorModel.find({
        _id: new ObjectId(medidasActualizar[0]._id),
      });
      console.log(cualquier, 'cualquier');

      // const a = await this._usuarioModel.updateOne(
      //   {
      //     'medidores.0.medidas.medida': 1111.11,
      //   },
      //   // {
      //   //   $set: {
      //   //     'medidores.0.medidas.3.vL1': 3.0,
      //   //   },
      //   // },
      // );
      // // console.log(a)
      // return a;
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

    console.log(medidorResp);
  }

  async buscarPorUsuarioyContrasena(criterioBusqueda: UsuarioPassDto) {
    try {
      const { cedula, password } = criterioBusqueda;
      const usuarioEncontrado = await this._usuarioModel
        .findOne({ cedula, password })
        .exec();

      if (!usuarioEncontrado) return null;
      const medidor = usuarioEncontrado.medidores[0];
      const medidas = medidor.medidas;
      const fechaActual = new Date(Date.now()).toISOString();

      const ultimoMedida = medidas[medidas.length - 1];

      const updateMedidas = moment(ultimoMedida.fecha).isSame(fechaActual);

      const medidorInfo = await this._apiMedidoresService.obtenerInfo(
        medidor.numMedidor,
      );

      console.log(updateMedidas, 'booleanoo');

      const medidasCreate = {
        fecha: new Date(Date.now()).toISOString(),
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

      console.log(ultimoMedida._id, 'idMEdidor');

      if (!updateMedidas) {
        (usuarioEncontrado as Usuario).medidores[0].medidas.push(medidasCreate);
        usuarioEncontrado.save();
        return usuarioEncontrado;
      } else {
        const a = await this._usuarioModel.updateOne(
          {
            'medidores.0.medidas.medida': 1111.11,
          },
          // {
          //   $set: {
          //     'medidores.0.medidas.3.vL1': 3.0,
          //   },
          // },
        );
        // console.log(a)
        return a;
      }

      // return ab;

      // Todo: hacer validacion de fecha y update

      // const medidorInfo = await this._apiMedidoresService.obtenerInfo(
      //   medidores[0].numMedidor,
      // );
      //
      // const medidor = await this._usuarioModel.findByIdAndUpdate(
      //   usuarioEncontrado._id,
      //   {
      //     $set: {
      //       'medidores.0.estado': JSON.parse(
      //         medidorInfo.list[0].data.find((d) => d.dataType === '42460002')
      //           .value,
      //       ),
      //     },
      //   },
      // );
      //
      // return {
      //   ...medidor,
      //   estado: JSON.parse(
      //     medidorInfo.list[0].data.find((d) => d.dataType === '42460002').value,
      //   ),
      // };
    } catch (e) {
      return 0;
    }
  }
}
