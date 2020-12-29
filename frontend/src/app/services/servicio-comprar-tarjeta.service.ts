import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Compra } from '../models/modelos';

@Injectable({
  providedIn: 'root'
})
export class ServicioComprarTarjetaService {

  constructor(private http: HttpClient) { }

  // -----------------------------------------------------------------------------------------------------------------------------------------------------
  obtenerDatosUsuario(id: string) {
    const url = 'http://35.202.137.102:5000/usuario/' + id;
    return this.http.get(url);
  }
  realizarCompra(compra: Compra) {
    const url = 'http://35.202.137.102:5000/compra/pago';
    console.log(compra);
    return this.http.post(url, compra);
  }
  obtenerTazaCambio() {
    const url = 'http://35.202.137.102:5000/cards/mongo';
    return this.http.get(url);
  }
  actualizarGiftcards() {
    const url = 'http://35.202.137.102:5000/cards';
    return this.http.get<any>(url, {})
      .pipe(map(data => {
        return data;
      }));
  }
}
