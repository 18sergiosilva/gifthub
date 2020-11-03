import { Component, OnInit } from '@angular/core';
import { NumberValueAccessor } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Giftcard4 } from '../models/modelos';
import { ServicioComprarTarjetaService } from '../services/servicio-comprar-tarjeta.service';
import { Utils } from '../utils/utils';

@Component({
  selector: 'app-pagar',
  templateUrl: './pagar.component.html',
  styleUrls: ['./pagar.component.scss']
})
export class PagarComponent implements OnInit {

  constructor(private route: ActivatedRoute, private comprarService: ServicioComprarTarjetaService) { }
  total = String(this.route.snapshot.params['total']);
  user = localStorage.getItem('user');
  tarjetas: any;
  tarjetaNueva = false;
  tarjeta = 'nueva';
  numero_nuevo: string;
  nombre_nuevo: string;
  mes_expiracion: string;
  ano_expiracion: string;
  texto_aux = 'Añadir';

  ngOnInit() {
    this.getData();
  }
  getData() {
    console.log(Utils.carrito);
    console.log(this.total);
    console.log(this.user);
    this.comprarService.obtenerDatosUsuario(this.user).subscribe((data: any) => {
      this.guardarDatos(data.usuario);
    });
  }
  guardarDatos(usuario: any) {
    this.tarjetas = usuario.tarjetasCredito;
  }

  pagar() {
    if (this.texto_aux === 'Añadir') {
      this.tarjetaNueva = true;
    } else {
      this.aceptar();
    }
  }

  aceptar() {
    const Giftcards = [];
    Utils.carrito.forEach(tarjeta => {
      const Giftcard: Giftcard4 = {
        idTarjeta: tarjeta.id,
        cantidad: '1'
      };
    });
    console.log(this.nombre_nuevo);
    console.log(this.numero_nuevo);
    console.log(this.mes_expiracion + '/' + this.ano_expiracion);
  }

  cambioTarjeta() {
    this.getTarjeta(this.tarjeta);
  }

  getTarjeta(tarjeta_num: string) {
    let keepGoing = true;
    this.tarjetas.forEach(tarjeta => {
      console.log(tarjeta.numero);
      if (keepGoing) {
        if (tarjeta.numero === tarjeta_num) {
          console.log(tarjeta.nombre);
          this.nombre_nuevo = tarjeta.nombre;
          this.numero_nuevo = tarjeta.numero;
          this.mes_expiracion = tarjeta.fecha.toString().substring(0, 2);
          this.ano_expiracion = tarjeta.fecha.toString().substring(tarjeta.fecha.toString().length - 2);
          keepGoing = false;
          this.texto_aux = 'Pagar';
          this.tarjetaNueva = false;
        } else {
          this.nombre_nuevo = '';
          this.numero_nuevo = '';
          this.mes_expiracion = '';
          this.ano_expiracion = '';
          this.texto_aux = 'Añadir';
        }
      }
    });
  }

}
