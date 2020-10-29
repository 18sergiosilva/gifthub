import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { ModificarUsuarioService } from '../services/modificar-usuario.service';

@Component({
  selector: 'app-historial-compras',
  templateUrl: './historial-compras.component.html',
  styleUrls: ['./historial-compras.component.scss']
})
export class HistorialComprasComponent implements OnInit {

  constructor(private router: Router, private http: HttpClient, private route: ActivatedRoute,private modificarService: ModificarUsuarioService) { }

  ngOnInit() {
    this.getTransacciones();
  }
  
  id="EAWLL";
  //id = String(this.route.snapshot.params['id']);
  compras=[];

  getTransacciones(): boolean {
    this.modificarService.obtenerDatosUsuario(this.id)
    .subscribe(
      data => {
        this.compras=data.usuario.transacciones;
        console.log(this.compras);
        return true;
      },
      error => {
        console.log(error);
        return false;
      });
      return true;
  }

  verCompra(id: string) {
    //this.router.navigate(['compra', id]);
    console.log("este ->"+ id);
  }

}
