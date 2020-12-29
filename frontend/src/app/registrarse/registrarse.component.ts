import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-registrarse',
  templateUrl: './registrarse.component.html',
  styleUrls: ['./registrarse.component.scss']
})
export class RegistrarseComponent implements OnInit {

  constructor(private router: Router, private http: HttpClient) { }

  ngOnInit() {
  }

  username = "";
  correo = "";
  contrasena = "";
  nombres = "";
  apellidos = "";
  dpi = "";
  edad = null;

  agregar() {
    console.log("username->"+this.username);
    console.log("correo->"+this.correo);
    console.log("contrasena->"+this.contrasena);
    console.log("nombres->"+this.nombres);
    console.log("apellidos->"+this.apellidos);
    console.log("dpi->"+this.dpi);
    console.log("edad->"+this.edad);

    // -----------------------------------------------------------------------------------------------------------------------------------------------------
    this.http.post('http://35.202.137.102:5000/usuario',
      {
        'username': this.username,
        'correo': this.correo,
        'contrasena': this.contrasena,
        'nombres':this.nombres,
        'apellidos':this.apellidos,
        'dpi':this.dpi,
        'edad':this.edad
      }).toPromise().then((data: any) => {
        console.log(data);
        this.cancelar();
      });

  }

  cancelar() {
    this.username = "";
    this.correo = "";
    this.contrasena = "";
    this.nombres = "";
    this.apellidos = "";
    this.dpi = "";
    this.edad = null;
  }

}
