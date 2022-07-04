import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom, map, tap } from 'rxjs';
import { RequestMedidoresInterface } from '../interfaces/request-medidores.interface';
import { ResponseMedidoresInterface } from '../interfaces/response-medidores.interface';

@Injectable()
export class ApiMedidoresService {
  url = 'http://172.17.46.137:8080/UIP/uip/uipManage/dataOper/';
  constructor(private readonly httpService: HttpService) {}

  async authAPI() {
    const json = await firstValueFrom(
      this.httpService
        .get(
          'http://172.17.46.137:8080/UIP/uip/uipManage/dataOper?interfaceCode=Authorization&userName=JRAMI &password=Jr@123456',
        )
        .pipe(
          map((rta) => {
            return rta.status === 200 ? rta.data : null;
          }),
        ),
    );
    if ('data' in json && 'token_id' in json.data) {
      return json.data.token_id;
    }
    return null;
  }

  async obtenerStatus(medidor: string) {
    const data: RequestMedidoresInterface = {
      interfaceCode: 'ReadRealtimeData',
      messageID: '1235',
      list: [
        {
          deviceId: medidor,
          deviceType: 'meter',
          data: [
            {
              dataType: '42460002',
            },
          ],
        },
      ],
    };
    // toPromise ==> firstValueFrom
    const statusMedidor = await firstValueFrom(
      this.httpService.post(this.url, data).pipe(
        map((resp) => {
          if (resp.status !== 200) {
            return false;
          }

          if (!('messageID' in resp.data)) {
            return false;
          }

          return true;
        }),
      ),
    );
    return statusMedidor;
  }

  async obtenerInfo(medidor: string) {
    const data: RequestMedidoresInterface = {
      interfaceCode: 'ReadRealtimeData',
      messageID: '1235',
      list: [
        {
          deviceId: medidor,
          deviceType: 'meter',
          data: [
            {
              dataType: '00000100',
            },
            {
              dataType: '42460002',
            },
            {
              dataType: '02000300',
            },
            {
              dataType: '02000302',
            },
            {
              dataType: '02010300',
            },
            {
              dataType: '02010302',
            },
          ],
        },
      ],
    };
    // toPromise ==> firstValueFrom
    const statusMedidor = await firstValueFrom(
      this.httpService.post<ResponseMedidoresInterface>(this.url, data).pipe(
        map((resp) => {
          if (resp.status !== 200) {
            return null;
          }

          if (!('messageID' in resp.data)) {
            return null;
          }

          return resp.data;
        }),
      ),
    );
    return statusMedidor;
  }
}
