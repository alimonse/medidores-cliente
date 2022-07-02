import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom, map } from 'rxjs';

@Injectable()
export class ApiMedidoresService {
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
}
