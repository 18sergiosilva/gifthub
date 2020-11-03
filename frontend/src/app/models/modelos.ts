export interface Giftcard {
    nombre: String;
    displayName: String;
    imagen: String;
    id: number;
    precio: number;
    availability: string;
}

export interface Giftcard2 {
    nombre: String;
    displayName: String;
    imagen: String;
    id: number;
    precio: number;
    availability: string;
    alfanumerico: string;
}

export interface Giftcard3 {
    nombre: String;
    displayName: String;
    imagen: String;
    id: number;
    precio: number;
    availability: string;
    cantidad: number;
    alfanumerico: string;
}

export interface Tarjeta {
    numero: String;
    nombre: String;
    fecha: String;
    condigoSeguridad: String;
}

export interface Giftcard4 {
    idTarjeta: String;
    cantidad: String;
}

export interface Compra {
    monto: String;
    username: String;
    tarjeta: Tarjeta;
    tarjetas: Array<Giftcard4>;
}
