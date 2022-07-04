export interface ResponseMedidoresInterface {
    messageID:     string;
    interfaceCode: string;
    list:          List[];
}

export interface List {
    deviceType: string;
    data:       Datum[];
    deviceId:   string;
}

export interface Datum {
    dataType: string;
    value:    string;
}
