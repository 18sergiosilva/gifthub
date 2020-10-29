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
    this.servicioRegalarGiftcards
      .obtenerGiftcards("BBCCI")
      .pipe(first())
      .subscribe(
        (data) => {
          this.giftcards = data["usuario"]["tarjetas"];
          for (var i = 0; i < this.giftcards.length; i++) {
            if (this.giftcards[i]["availability"] == 1) {
              const vistaGiftcard: Giftcard3 = {
                nombre: this.giftcards[i]["name"],
                imagen: this.giftcards[i]["image"],
                id: this.giftcards[i]["id"],
                precio: 10 + 10 * this.giftcards[i]["chargeRate"],
                displayName: this.giftcards[i]["name"] + " - $10.00",
                availability: this.giftcards[i]["availability"],
                cantidad : this.giftcards[i]["cantidad"],
              };
              this.listaDeGiftcards.push(vistaGiftcard);
              //console.log(vistaGiftcard.displayName);
            } else if (this.giftcards[i]["availability"] == 2) {
              const vistaGiftcard: Giftcard3 = {
                nombre: this.giftcards[i]["name"],
                imagen: this.giftcards[i]["image"],
                id: this.giftcards[i]["id"],
                precio: 25 + 25 * this.giftcards[i]["chargeRate"],
                displayName: this.giftcards[i]["name"] + " - $25.00",
                availability: this.giftcards[i]["availability"],
                cantidad : this.giftcards[i]["cantidad"],
              };
              this.listaDeGiftcards.push(vistaGiftcard);
              //console.log(vistaGiftcard.displayName);
            } else if (this.giftcards[i]["availability"] == 3) {
              const vistaGiftcard: Giftcard3 = {
                nombre: this.giftcards[i]["name"],
                imagen: this.giftcards[i]["image"],
                id: this.giftcards[i]["id"],
                precio: 50 + 50 * this.giftcards[i]["chargeRate"],
                displayName: this.giftcards[i]["name"] + " - $50.00",
                availability: this.giftcards[i]["availability"],
                cantidad : this.giftcards[i]["cantidad"],
              };
              this.listaDeGiftcards.push(vistaGiftcard);
              //console.log(vistaGiftcard.displayName);
            } else if (this.giftcards[i]["availability"] == 4) {
              const vistaGiftcard: Giftcard3 = {
                nombre: this.giftcards[i]["name"],
                imagen: this.giftcards[i]["image"],
                precio: 100 + 100 * this.giftcards[i]["chargeRate"],
                id: this.giftcards[i]["id"],
                displayName: this.giftcards[i]["name"] + " - $100.00",
                availability: this.giftcards[i]["availability"],
                cantidad : this.giftcards[i]["cantidad"],
              };
              this.listaDeGiftcards.push(vistaGiftcard);
              //console.log(vistaGiftcard.displayName);
            }
          }
        },
        (error) => {
          console.log(error);
        }
      );
  }

}
