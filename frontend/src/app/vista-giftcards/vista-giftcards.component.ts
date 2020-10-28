import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ServicioVistaGiftcardsService } from '../services/servicio-vista-giftcards.service'
import { first } from 'rxjs/operators';
//import { Venta, Producto, Factura } from '../models/modelos';

@Component({
  selector: 'app-vista-giftcards',
  templateUrl: './vista-giftcards.component.html',
  styleUrls: ['./vista-giftcards.component.css']
})
export class VistaGiftcardsComponent implements OnInit {

  constructor(private servicioVistaGiftcards: ServicioVistaGiftcardsService) { }

  ngOnInit(): void {
    this.actualizarGiftcards();
    this.getGiftcardsLocales();
  }

  actualizarGiftcards() {
    this.servicioVistaGiftcards.actualizarGiftcards()
      .pipe(first())
      .subscribe(
        data => {
          console.log("data actualizada");
        },
        error => {
          console.log(error);
        });
  }

  getGiftcardsLocales(){

    this.servicioVistaGiftcards.getGiftcardsLocales()
      .pipe(first())
      .subscribe(
        data => {
          console.log("LA INFO ",data);
        },
        error => {
          console.log(error);
        });

  }

}
