import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { ServicioHistorialService } from '../services/servicio-historial.service';

@Component({
  selector: 'app-historial-compras',
  templateUrl: './historial-compras.component.html',
  styleUrls: ['./historial-compras.component.scss']
})
export class HistorialComprasComponent implements OnInit {

  constructor(private router: Router, private http: HttpClient, private route: ActivatedRoute,private historialServ: ServicioHistorialService) { }

  ngOnInit() {
    if (localStorage.getItem('logued') !== '1') {
      localStorage.setItem('logued', '0');
      this.router.navigate(['login']);
    }
    this.getTransacciones();
  }
  
  //id="TGYFR";
  id=localStorage.getItem("user");
  //id = String(this.route.snapshot.params['id']);
  compras=[];
  detallesCompra=[];

  getTransacciones(): boolean {
    this.historialServ.obtener(this.id)
    .subscribe(
      data => {
        this.compras=data.usuario.transacciones;
        //console.log(this.compras);
        return true;
      },
      error => {
        console.log(error);
        return false;
      });
      return true;
  }

  verCompra(no: string) {
    this.detallesCompra=this.compras[no];
    let id=this.id;
    //console.log(this.detallesCompra);
    this.router.navigate(['detallescompra',id,no]);
  }

}
