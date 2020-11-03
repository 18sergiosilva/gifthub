import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Giftcard } from '../models/modelos';
import { Utils } from '../utils/utils';


@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.scss']
})
export class CarritoComponent implements OnInit {

  constructor(private router: Router) { }
  user = localStorage.getItem('user');
  carrito = Utils.carrito;
  total: number;

  ngOnInit() {
    this.total = this.gettotal();
  }

  gettotal(): number {
    let total = 0;
    this.carrito.forEach(tarjeta => {
      total = total + tarjeta.precio;
    });
    return total;
  }

  eliminar(giftcard: Giftcard, valor: number) {
    console.log(giftcard);
    const foundIndex = this.carrito.indexOf(giftcard);
    console.log(foundIndex);
    this.carrito = this.carrito.filter((_, index) => index !== foundIndex);
    this.total = this.total - valor;
  }

  pagar() {
    Utils.carrito = this.carrito;
    this.router.navigate(['pago', this.total]);
  }
}
