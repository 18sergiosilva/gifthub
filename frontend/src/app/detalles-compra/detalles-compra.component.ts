import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ServicioHistorialService } from '../services/servicio-historial.service';
import { ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-detalles-compra',
  templateUrl: './detalles-compra.component.html',
  styleUrls: ['./detalles-compra.component.scss']
})
export class DetallesCompraComponent implements OnInit {

  constructor(private router: Router, private http: HttpClient, private route: ActivatedRoute, private historialServ: ServicioHistorialService) { }

  ngOnInit() {
    this.getTransacciones();
  }

  id="TGYFR";
  //no=0;
  //id = String(this.route.snapshot.params['id']); 
  //id=localStorage.getItem("user");
  no = String(this.route.snapshot.params['no']);
  compras = [];
  detallesCompra;
  arr = [];
  num="";
  fecha;
  cvv;
  tot;
  status;
  precios = [];
  recargo=[];
  preciosReales = [];
  preciosTotales = [];
  recargos = [];
  ava = [];
  cants=[];
  totales=[];
  transaccion;
  alfa=[];

  getTransacciones(): boolean {
    this.historialServ.obtener(this.id)
      .subscribe(
        data => {
          this.compras = data.usuario.transacciones;
          this.detallesCompra = this.compras[this.no];
          this.num = this.detallesCompra.numeroEncriptado;
          /*if(this.num=""){
            this.num="1234XXXXXXXX1234";
          }*/
          this.fecha = this.detallesCompra.fecha;
          this.cvv = this.detallesCompra.codigoSeguridad;
          this.transaccion = this.detallesCompra.transaccion;

          this.arr = this.detallesCompra.tarjetas;
          //console.log(this.arr);
          this.tot = this.detallesCompra.totalApagar;
          this.status = this.detallesCompra.transaccion;
          //console.log(this.compras);
          //console.log(this.detallesCompra);
          this.getPrecios(this.arr);
          return true;
        },
        error => {
          //console.log(error);
          return false;
        });
    return true;
  }

  getPrecios(arr) {
    this.arr.forEach(element => {
      this.ava.push(element.availability);
      this.recargo.push(element.chargeRate);
      this.cants.push(1);
      this.alfa.push(element.alfanumerico);
    });
    this.historialServ.getPrecios()
      .subscribe(
        data => {
          this.precios = data;
          console.log(this.precios);
          for (let index = 0; index < this.arr.length; index++) {
            const element = this.arr[index].availability;

            for (let ind = 0; ind < this.precios.length; ind++) {
              const elId = this.precios[ind].id;

              if (elId == element) {
                this.preciosReales.push(this.precios[ind].total);
              }

            }
          }

          for (let index = 0; index < this.recargo.length; index++) {
            var x = this.recargo[index];
            var xcant=x*this.cants[index];
            this.recargos.push(xcant);
            var y: number = +x;
            var xx = this.preciosReales[index];
            var yy: number = +xx;
            let suma = y+yy;
            let totalito= xx*this.cants[index]+xcant;
            this.totales.push(totalito);
            this.preciosTotales.push(suma);
          }
          //console.log(this.preciosReales);
        },
        error => {
          console.log(error);
          return false;
        });
    return true;
  }

}
