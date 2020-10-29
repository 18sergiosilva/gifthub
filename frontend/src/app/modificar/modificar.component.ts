import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { ModificarUsuarioService } from '../services/modificar-usuario.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-modificar',
  templateUrl: './modificar.component.html',
  styleUrls: ['./modificar.component.scss']
})
export class ModificarComponent implements OnInit {

  constructor(private router: Router, private http: HttpClient, private route: ActivatedRoute,private modificarService: ModificarUsuarioService) {}

    //datos
    usuario;
    id="EAWLL";
    //id = String(this.route.snapshot.params['id']);
    httpdata;
    httpdata1;
    username = "";
    correo = "";
    contrasena = "";
    nombres = "";
    apellidos = "";
    dpi = "";
    edad = null;

  ngOnInit() {
    this.cargarDatosUsuario();
  }

  cargarDatosUsuario(): boolean {
      this.modificarService.obtenerDatosUsuario(this.id)
      .pipe(first())
      .subscribe(
        data => {
          //console.log(data);
          this.usuario = data.usuario;
          this.displaydata(this.usuario);
          return true;
        },
        error => {
          console.log(error);
          return false;
        });
        return true;
    }

  displaydata(data) {
    this.httpdata1 = data;
    //console.log(this.httpdata1);
    this.username=data.username;
    this.correo = data.correo;
    this.contrasena = data.contrasena;
    this.nombres = data.nombres;
    this.apellidos = data.apellidos;
    this.dpi = data.dpi;
    this.edad = data.edad;
  }

  editarUsuario(): boolean {
    this.modificarService.modificarDatosUser(this.id,this.correo,this.contrasena,this.nombres,this.apellidos,this.dpi,this.edad)
    .pipe(first())
    .subscribe(
      data => {
        //console.log(data);
        this.router.navigate(['giftcards']);
      },
      error => {
        console.log(error);
        return false;
      });
      return true;
  }

  cancelar() {
    this.router.navigate(['giftcards']);
  }

}
