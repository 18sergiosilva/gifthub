import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ServicioVistaGiftcardsService {

  constructor(private http: HttpClient, private router: Router) { }

  actualizarGiftcards(){
    let apiUrl = 'http://35.239.230.8:5000/cards';
    return this.http.get<any>(apiUrl, {})
      .pipe(map(data => {
        return data;
      }));
  }

  getGiftcardsLocales(){

    let apiUrl = 'http://35.239.230.8:5000/cards/mongo';
    return this.http.get<any>(apiUrl, {})
      .pipe(map(data => {
        return data;
      }));

  }
}
