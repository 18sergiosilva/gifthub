import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ModificarUsuarioService {

  constructor(private http: HttpClient, private router: Router) { }

  // -----------------------------------------------------------------------------------------------------------------------------------------------------
  obtenerDatosUsuario(id) {
    let apiUrl = 'http://100.26.35.98:5000/usuario/' + id;
    return this.http.get<any>(apiUrl, {})
      .pipe(map(data => {
        return data;
      }));
  }

  // -----------------------------------------------------------------------------------------------------------------------------------------------------
  modificarDatosUser(id,correo,contra,nombres,apellidos,dpi,edad){
    let apiUrl = 'http://100.26.35.98:5000/usuario/'+id;
    return this.http.put<any>(apiUrl, {
        'correo': correo,
        'contrasena': contra,
        'nombres':nombres,
        'apellidos':apellidos,
        'dpi':dpi,
        'edad':edad
    })
      .pipe(map(data => {
        return data;
      }));

  }
}
