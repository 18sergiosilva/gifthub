import { Component, OnInit } from '@angular/core';
import { ServicioRegalarService } from "../services/servicio-regalar.service";
import { first } from "rxjs/operators";
import { Giftcard3 } from "../models/modelos";


@Component({
  selector: 'app-inventario-giftcards',
  templateUrl: './inventario-giftcards.component.html',
  styleUrls: ['./inventario-giftcards.component.scss']
})
export class InventarioGiftcardsComponent implements OnInit {

  constructor(private servicioRegalarGiftcards: ServicioRegalarService) { }

  giftcards = [];
  listaDeGiftcards = [];
  carritoLocal = [];
  giftcard = "";
  cantidad = "";
  usuarioBeneficio = "";

  ngOnInit() {

    this.getGiftcards();
    
  }



  getGiftcards() {
    let usuarioz:string = localStorage.getItem('user');
    this.servicioRegalarGiftcards
      .obtenerGiftcards(usuarioz)
      .pipe(first())
      .subscribe(
        (data) => {
          this.giftcards = data["usuario"]["tarjetas"];
          for (var i = 0; i < this.longitud(); i++) {
            if (this.disponibilidad(i) == "1") {
              const vistaGiftcard: Giftcard3 = {
                nombre: this.giftcards[i]["name"],
                imagen: this.giftcards[i]["image"],
                id: this.giftcards[i]["id"],
                precio: 10 + 10 * this.giftcards[i]["chargeRate"],
                displayName: this.giftcards[i]["name"] + " - $10.00",
                availability: this.giftcards[i]["availability"],
                cantidad : this.giftcards[i]["cantidad"],
              };
              this.agregarGiftcard(vistaGiftcard);
              //this.listaDeGiftcards.push(vistaGiftcard);
              //console.log(vistaGiftcard.displayName);
            } else if (this.disponibilidad(i) == "2") {
              const vistaGiftcard: Giftcard3 = {
                nombre: this.giftcards[i]["name"],
                imagen: this.giftcards[i]["image"],
                id: this.giftcards[i]["id"],
                precio: 25 + 25 * this.giftcards[i]["chargeRate"],
                displayName: this.giftcards[i]["name"] + " - $25.00",
                availability: this.giftcards[i]["availability"],
                cantidad : this.giftcards[i]["cantidad"],
              };
              this.agregarGiftcard(vistaGiftcard);
              //this.listaDeGiftcards.push(vistaGiftcard);
              //console.log(vistaGiftcard.displayName);
            } else if (this.disponibilidad(i) == "3") {
              const vistaGiftcard: Giftcard3 = {
                nombre: this.giftcards[i]["name"],
                imagen: this.giftcards[i]["image"],
                id: this.giftcards[i]["id"],
                precio: 50 + 50 * this.giftcards[i]["chargeRate"],
                displayName: this.giftcards[i]["name"] + " - $50.00",
                availability: this.giftcards[i]["availability"],
                cantidad : this.giftcards[i]["cantidad"],
              };
              this.agregarGiftcard(vistaGiftcard);
              //this.listaDeGiftcards.push(vistaGiftcard);
              //console.log(vistaGiftcard.displayName);
            } else if (this.disponibilidad(i) == "4") {
              const vistaGiftcard: Giftcard3 = {
                nombre: this.giftcards[i]["name"],
                imagen: this.giftcards[i]["image"],
                precio: 100 + 100 * this.giftcards[i]["chargeRate"],
                id: this.giftcards[i]["id"],
                displayName: this.giftcards[i]["name"] + " - $100.00",
                availability: this.giftcards[i]["availability"],
                cantidad : this.giftcards[i]["cantidad"],
              };
              this.agregarGiftcard(vistaGiftcard);
              //this.listaDeGiftcards.push(vistaGiftcard);
              //console.log(vistaGiftcard.displayName);
            }
          }
        },
        (error) => {
          this.imprimirError(error);
        }
      );
  }


  imprimirError(error:string):string{
    console.log(error);
    return "impreso";
  }

  agregarGiftcard(gc:Giftcard3):boolean{
    this.listaDeGiftcards.push(gc);
    return true;
  }

  disponibilidad(i: number):string{
    return this.giftcards[i]["availability"];
  }

  longitud():number{
    return this.giftcards.length;
  }

  

}
