import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ServicioHistorialService } from '../services/servicio-historial.service';
import { ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';
import { Utils } from '../utils/utils';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  constructor(private router: Router, private http: HttpClient, private route: ActivatedRoute, private historialServ: ServicioHistorialService) { }

  transacciones=[];
  tarjetas=[];

  ngOnInit() {
    if (localStorage.getItem('logued') !== '1') {
      localStorage.setItem('logued', '0');
      this.router.navigate(['login']);
    }
    if (localStorage.getItem('user') !== 'admin') {
      Utils.indices = [
        {
          title: 'Catalogo de Giftcards',
          url: '/giftcards',
          icon: 'mdi-coin'
        },
        {
          title: 'Mis Giftcards',
          url: '/inventario',
          icon: 'mdi-checkbox-multiple-blank'
        },
        {
          title: 'Regalar Giftcards',
          url: '/regalar',
          icon: 'mdi-gift'
        },
        {
          title: 'Historial de Compras',
          url: '/compras',
          icon: 'mdi-history'
        },
        {
          title: 'Configurar Cuenta',
          url: '/modificar',
          icon: 'mdi-pencil'
        }
        ,
        {
          title: 'Cerrar Sesión',
          url: '',
          icon: 'mdi-exit-to-app'
        }
      ];
      this.router.navigate(['home']);
    }
    this.getTransacciones();
  }

  getTransacciones(): boolean {
    this.historialServ.getTransacciones()
      .subscribe(
        data => {
          this.transacciones = data.transacciones;
          this.getPrecios(this.transacciones);
          return true;
        },
        error => {
          //console.log(error);
          return false;
        });
    return true;
  }

  getPrecios(arrTransacciones){
    //console.log(arrTransacciones);
    arrTransacciones.forEach(element => {
      this.tarjetas.push(element.tarjetas);
    });
  }

}
