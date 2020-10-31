export const DATOS: any = {
        message: "Usuario encontrado desde mock",
        usuario: {
            tarjetas: [],
            transacciones: [],
            tarjetasCredito: [],
            username: "MKJLW",
            correo: "amet.dapibus@dolordolortempus.net",
            contrasena: "IJA20SAJ8KI",
            nombres: "Rigel",
            apellidos: "Griffin",
            dpi: 745027164490,
            edad: 67,
            id: "5f9a586ea9be5b9630ba8590"
        }
}

export const REGALO: any = {
    message: "Tarjeta regalada con exito desde mock"
}

export const ACTUALIZACION: any = {
    message: "giftcards actualizadas desde mock"
}


export const PROPIABASE: any = {
    message: "Se devolvieron las giftcards desde mock",
    cards: {
        Card: [
            {
                id: 1,
                name: "Google Play",
                image: "https://media.karousell.com/media/photos/products/2020/5/21/rm50_goggle_play_gift_card_mal_1590040469_c1100b5a_progressive.jpg",
                chargeRate: 1,
                active: false,
                availability: [
                    1,
                    2,
                    4
                ]
            },
            {
                id: 2,
                name: "PlayStation",
                image: "https://www.allkeyshop.com/blog/wp-content/uploads/PlayStationNetworkGiftCard.jpg",
                chargeRate: 0.25,
                active: true,
                availability: [
                    1,
                    3
                ]
            },
            {
                id: 3,
                name: "Steam",
                image: "https://mojolika.com/wp-content/uploads/2019/04/196.png",
                chargeRate: 0.1,
                active: true,
                availability: [
                    1,
                    2
                ]
            },
            {
                id: 4,
                name: "Amazon",
                image: "https://www.shopmyexchange.com/products/images/xlarge/2008097_0000.jpg",
                chargeRate: 0.5,
                active: false,
                availability: [
                    2,
                    4,
                    1
                ]
            },
            {
                id: 5,
                name: "Microsoft",
                image: "https://img-prod-cms-rt-microsoft-com.akamaized.net/cms/api/am/imageFileData/RE1XIn1?ver=1a7a",
                chargeRate: 0.75,
                active: true,
                availability: [
                    2,
                    3,
                    1
                ]
            }
        ],
        Value: [
            {
                id: 1,
                total: 10
            },
            {
                id: 2,
                total: 25
            },
            {
                id: 3,
                total: 50
            },
            {
                id: 4,
                total: 100
            }
        ],
        TasaCambio: [
            {
                total: 7.85
            }
        ],
        createdAt: "2020-10-31T06:10:41.267Z",
        updatedAt: "2020-10-31T06:10:41.267Z",
        id: "5f9cffe12bb1e925670dc9b6"
    }
}