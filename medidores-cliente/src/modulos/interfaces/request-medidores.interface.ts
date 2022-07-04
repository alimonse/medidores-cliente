export interface RequestMedidoresInterface {
  interfaceCode: string;
  messageID: string;
  list: List[];
}

export interface List {
  deviceId: string;
  deviceType: string;
  data: Datum[];
}

export interface Datum {
  dataType: string;
}
