import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ServicioHistorialService } from '../services/servicio-historial.service';
import { ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';

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
