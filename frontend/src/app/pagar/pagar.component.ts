import { Component, OnInit } from '@angular/core';
import { NumberValueAccessor } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Compra, Giftcard4, Tarjeta } from '../models/modelos';
import { ServicioComprarTarjetaService } from '../services/servicio-comprar-tarjeta.service';
import { Utils } from '../utils/utils';

@Component({
  selector: 'app-pagar',
  templateUrl: './pagar.component.html',
  styleUrls: ['./pagar.component.scss']
})
export class PagarComponent implements OnInit {

  constructor(private route: ActivatedRoute, private comprarService: ServicioComprarTarjetaService, private router: Router) { }
  total = String(this.route.snapshot.params['total']);
  total_copia = this.total;
  user = localStorage.getItem('user');
  tarjetas: any;
  tarjetaNueva = false;
  tarjeta = 'nueva';
  numero_nuevo: string;
  nombre_nuevo: string;
  codigo_nuevo: string;
  mes_expiracion: string;
  ano_expiracion: string;
  texto_aux = 'Añadir';
  moneda = '$.';

  ngOnInit() {
    this.getData();
  }
  getData() {
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
    const giftcards = [];
    Utils.carrito.forEach(tarjeta => {
      const giftcard: Giftcard4 = {
        idTarjeta: tarjeta.id,
        cantidad: '1',
        availability: tarjeta.availability
      };
      giftcards.push(giftcard);
    });
    const tarjeta_credito: Tarjeta = {
      numero: this.numero_nuevo,
      nombre: this.nombre_nuevo,
      fecha: this.mes_expiracion + '/' + this.ano_expiracion,
      codigoSeguridad: this.codigo_nuevo
    };
    const compra: Compra = {
      monto: this.total,
      username: this.user,
      tarjeta: tarjeta_credito,
      tarjetas: giftcards
    };
    console.log(compra);
    this.comprarService.realizarCompra(compra).subscribe((data: any) => {
      console.log(data);
      this.router.navigate(['home']);
    });
  }

  cambioTarjeta() {
    this.getTarjeta(this.tarjeta);
  }

  cambioMoneda() {
    if (this.moneda === 'Q.') {
      this.comprarService.actualizarGiftcards();
      this.comprarService.obtenerTazaCambio().subscribe((data: any) => {
        this.total_copia = (this.getNumber(this.total_copia) * this.getNumber(data.cards[0].TasaCambio[0].total)).toString();
      });
    } else {
      this.total_copia = this.total;
    }
  }
  getNumber(total_copia: string): number {
    return Number(total_copia);
  }

  getTarjeta(tarjeta_num: string) {
    let keepGoing = true;
    this.tarjetas.forEach(tarjeta => {
      if (keepGoing) {
        if (tarjeta.numero === tarjeta_num) {
          console.log(tarjeta.nombre);
          this.nombre_nuevo = tarjeta.nombre;
          this.codigo_nuevo = tarjeta.codigoSeguridad;
          this.numero_nuevo = tarjeta.numero;
          this.mes_expiracion = tarjeta.fecha.toString().substring(0, 2);
          this.ano_expiracion = tarjeta.fecha.toString().substring(tarjeta.fecha.toString().length - 2);
          keepGoing = false;
          this.texto_aux = 'Pagar';
          this.tarjetaNueva = false;
        } else {
          this.nombre_nuevo = '';
          this.numero_nuevo = '';
          this.codigo_nuevo = '';
          this.mes_expiracion = '';
          this.ano_expiracion = '';
          this.texto_aux = 'Añadir';
        }
      }
    });
  }

}
