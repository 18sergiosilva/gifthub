import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Location } from '@angular/common';
import { map } from 'rxjs/operators';
import { Utils } from '../utils/utils';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private router: Router, private http: HttpClient, private location: Location) { }
  correo: string;
  contra: string;
  incorrecto = false;

  ngOnInit() {
    if (localStorage.getItem('logued') === '1') {
      localStorage.setItem('logued', '0');
      this.router.navigate(['login']);
    }
    Utils.indices = [
      {
        title: 'Ingresar',
        url: '/login',
        icon: 'mdi-settings-box'
      },
      {
        title: 'Registrarse',
        url: '/registrarse',
        icon: 'mdi-account-multiple-plus'
      }
    ];
  }
  entrar() {
    // -----------------------------------------------------------------------------------------------------------------------------------------------------
    this.http.post('http://35.202.137.102:5000/login',    
      {
        'userOMail': this.correo,
        'pass': this.contra
      }).subscribe((data: any) => {
        localStorage.setItem('user', data.usuario.username);
        localStorage.setItem('logued', '1');
        Utils.indices = [
          {
            title: 'Catalogo de Juegos',
            url: '/giftcards',
            icon: 'mdi-gamepad-variant'
          },
          {
            title: 'Juegos Descargados',
            url: '/inventario',
            icon: 'mdi-download'
          },
          {
            title: 'Configurar Cuenta',
            url: '/modificar',
            icon: 'mdi-pencil'
          }
        ];
        Utils.indices.push(
          {
            title: 'Cerrar Sesión',
            url: '',
            icon: 'mdi-exit-to-app'
          }
        );
        this.router.navigate(['home']);
      },
        (error: HttpErrorResponse) => {
          this.cancelar();
          this.incorrecto = true;
        });
  }

  cancelar() {
    this.correo = '';
    this.contra = '';
    this.incorrecto = false;
  }

}
