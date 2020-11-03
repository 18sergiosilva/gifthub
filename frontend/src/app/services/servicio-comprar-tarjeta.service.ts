import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Compra } from '../models/modelos';

@Injectable({
  providedIn: 'root'
})
export class ServicioComprarTarjetaService {

  constructor(private http: HttpClient) { }

  obtenerDatosUsuario(id: string) {
    const url = 'http://35.239.230.8:5000/usuario/' + id;
    return this.http.get(url);
  }
  realizarCompra(compra: Compra) {

  }
}
