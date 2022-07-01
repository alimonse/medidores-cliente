import { Injectable } from '@nestjs/common';
import {HttpService} from "@nestjs/axios";

@Injectable()
export class ApiMedidoresService {
    constructor(private readonly httpService: HttpService) {}

    async authAPI(){
       return this.httpService.get('http://172.17.46.137:8080/UIP/uip/uipManage/dataOper?interfaceCode=Authorization&userName=JRAMI &password=Jr@123456')
           .subscribe(resp => {
               console.log(resp);})
    }
}
