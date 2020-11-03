export interface Giftcard {
    nombre: String;
    displayName: String;
    imagen: String;
    id: number;
    precio: number;
}

export interface Giftcard2 {
    nombre: String;
<<<<<<< HEAD
    displayName: String,
    imagen: String,
    id: number,
    precio: number,
    availability: string,
    alfanumerico: string
=======
    displayName: String;
    imagen: String;
    id: number;
    precio: number;
    availability: string;
>>>>>>> vista-pago
}

export interface Giftcard3 {
    nombre: String;
<<<<<<< HEAD
    displayName: String,
    imagen: String,
    id: number,
    precio: number,
    availability: string,
    cantidad: number,
    alfanumerico: string
}
=======
    displayName: String;
    imagen: String;
    id: number;
    precio: number;
    availability: string;
    cantidad: number;
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
>>>>>>> vista-pago
