import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ServicioHistorialService {

  constructor(private http: HttpClient, private router: Router) { }

  obtener(id) {
    let apiUrl = 'http://35.239.230.8:5000/usuario/' + id;
    return this.http.get<any>(apiUrl, {})
      .pipe(map(data => {
        return data;
      }));
  }

  getPrecios() {
    let apiUrl = 'https://my-json-server.typicode.com/CoffeePaw/AyD1API/Value';
    return this.http.get<any>(apiUrl, {})
      .pipe(map(data => {
        return data;
      }));
  }
}


