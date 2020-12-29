import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ServicioRegalarService {

  constructor(private http: HttpClient, private router: Router) { }


  obtenerGiftcards(usuario:string){
    let apiUrl = 'http://35.202.137.102:5000/usuario/'+usuario;
    return this.http.get<any>(apiUrl, {})
      .pipe(map(data => {
        return data;
      }));
  }


  regalarTarjeta(usuarioRegala: string, usuarioBeneficio: string, cantidad: number, availability: string, id: string){
    let apiUrl = 'http://35.202.137.102:5000/regalar';
    return this.http.post(apiUrl,{
      "usuario1":usuarioRegala,
      "usuario2":usuarioBeneficio,
      "giftcards":[{"id":id, "cantidad":cantidad, "availability": availability}],
    })
    .pipe(map(data => {
      return data;
    }));
  }
}
