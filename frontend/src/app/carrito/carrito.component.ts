import { Component, OnInit } from '@angular/core';
import { Utils } from '../utils/utils';

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.scss']
})
export class CarritoComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    console.log(Utils.carrito);
  }

}
