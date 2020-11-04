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

    this.http.post('http://35.239.230.8:5000/login',
      {
        'userOMail': this.correo,
        'pass': this.contra
      }).subscribe((data: any) => {
        localStorage.setItem('user', this.correo);
        localStorage.setItem('logued', '1');
        Utils.indices = [
          {
            title: 'Giftcards Disponibles',
            url: '/giftcards',
            icon: 'mdi-coin'
          },
          {
            title: 'Regalar Giftcards',
            url: '/regalar',
            icon: 'mdi-gift'
          },
          {
            title: 'Giftcards Adquiridas',
            url: '/inventario',
            icon: 'mdi-checkbox-multiple-blank'
          },
          {
            title: 'Historial de Compras',
            url: '/compras',
            icon: 'mdi-history'
          },
          {
            title: 'Modificar Datos',
            url: '/modificar',
            icon: 'mdi-pencil'
          }
        ];
        if (this.correo === 'admin') {
          Utils.indices.push(
            {
              title: 'Detalle Transacciones',
              url: '/admin',
              icon: 'mdi-crown'
            }
          );
        }
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
        });
  }

  cancelar() {
    this.correo = '';
    this.contra = '';
  }

}
