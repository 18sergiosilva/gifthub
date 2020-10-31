import { Component, OnInit, ɵConsole } from "@angular/core";
import { ServicioRegalarService } from "../services/servicio-regalar.service";
import { first } from "rxjs/operators";
import { Giftcard2 } from "../models/modelos";

@Component({
  selector: "app-regalar-giftcards",
  templateUrl: "./regalar-giftcards.component.html",
  styleUrls: ["./regalar-giftcards.component.scss"],
})
export class RegalarGiftcardsComponent implements OnInit {
  constructor(private servicioRegalarGiftcards: ServicioRegalarService) {}

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
          for (var i = 0; i < this.longitud(); i++) {
            if (this.disponibilidad(i) == "1") {
              const vistaGiftcard: Giftcard2 = {
                nombre: this.giftcards[i]["name"],
                imagen: this.giftcards[i]["image"],
                id: this.giftcards[i]["id"],
                precio: 10 + 10 * this.giftcards[i]["chargeRate"],
                displayName: this.giftcards[i]["name"] + " - $10.00",
                availability: this.giftcards[i]["availability"],
              };
              this.agregarGiftcard(vistaGiftcard);
              //this.listaDeGiftcards.push(vistaGiftcard);
              //console.log(vistaGiftcard.displayName);
            } else if (this.disponibilidad(i) == "2") {
              const vistaGiftcard: Giftcard2 = {
                nombre: this.giftcards[i]["name"],
                imagen: this.giftcards[i]["image"],
                id: this.giftcards[i]["id"],
                precio: 25 + 25 * this.giftcards[i]["chargeRate"],
                displayName: this.giftcards[i]["name"] + " - $25.00",
                availability: this.giftcards[i]["availability"],
              };
              this.agregarGiftcard(vistaGiftcard);
              //this.listaDeGiftcards.push(vistaGiftcard);
              //console.log(vistaGiftcard.displayName);
            } else if (this.disponibilidad(i) == "3") {
              const vistaGiftcard: Giftcard2 = {
                nombre: this.giftcards[i]["name"],
                imagen: this.giftcards[i]["image"],
                id: this.giftcards[i]["id"],
                precio: 50 + 50 * this.giftcards[i]["chargeRate"],
                displayName: this.giftcards[i]["name"] + " - $50.00",
                availability: this.giftcards[i]["availability"],
              };
              this.agregarGiftcard(vistaGiftcard);
              //this.listaDeGiftcards.push(vistaGiftcard);
              //console.log(vistaGiftcard.displayName);
            } else if (this.disponibilidad(i) == "4") {
              const vistaGiftcard: Giftcard2 = {
                nombre: this.giftcards[i]["name"],
                imagen: this.giftcards[i]["image"],
                precio: 100 + 100 * this.giftcards[i]["chargeRate"],
                id: this.giftcards[i]["id"],
                displayName: this.giftcards[i]["name"] + " - $100.00",
                availability: this.giftcards[i]["availability"],
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

  regalarGiftcard():boolean {
    for (var i = 0; i < this.longitud2(); i++) {
      if (this.listaDeGiftcards[i].displayName == this.giftcard) {
        //console.log("id ", this.listaDeGiftcards[i].id);
        //console.log("nose", this.listaDeGiftcards[i].nombre);
        this.servicioRegalarGiftcards.regalarTarjeta("BBCCI", this.usuarioBeneficio, Number(this.cantidad), this.listaDeGiftcards[i].availability,Number(this.listaDeGiftcards[i].id))
          .pipe(first())
          .subscribe(
            (data) => {
              this.imprimirError("REGALADA");
              return true;
              //console.log("REGALADA", data);
            },
            (error) => {
              this.imprimirError(error);
              return false;
            }
          );
      }
    }
    return false;
  }





  imprimirError(error:string):string{
    console.log(error);
    return "impreso";
  }

  agregarGiftcard(gc:Giftcard2):boolean{
    this.listaDeGiftcards.push(gc);
    return true;
  }

  disponibilidad(i: number):string{
    return this.giftcards[i]["availability"];
  }

  longitud():number{
    return this.giftcards.length;
  }

  longitud2():number{
    return this.listaDeGiftcards.length;
  }


  getDisplay(i:number):string{
    return this.listaDeGiftcards[i].displayName;
  }
}
