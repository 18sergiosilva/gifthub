import { Component, OnInit } from '@angular/core';
import { ServicioVistaGiftcardsService } from '../services/servicio-vista-giftcards.service'
import { first } from 'rxjs/operators';
import { Giftcard } from '../models/modelos';
import { Utils } from '../utils/utils';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-vista-giftcards',
  templateUrl: './vista-giftcards.component.html',
  styleUrls: ['./vista-giftcards.component.css']
})
export class VistaGiftcardsComponent implements OnInit {

  constructor(private router: Router, private servicioVistaGiftcards: ServicioVistaGiftcardsService, private toastr: ToastrService) { }

  giftcards = [];
  listaDeGiftcards = [];
  carritoLocal = [];

  ngOnInit(): void {
    this.actualizarGiftcards();
  }

  actualizarGiftcards() {
    this.servicioVistaGiftcards.actualizarGiftcards()
      .pipe(first())
      .subscribe(
        data => {
          console.log("data actualizada");
          this.getGiftcardsLocales();
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
          this.giftcards = data.cards[0]["Card"];
          for (var i = 0; i < this.giftcards.length; i++){
            if (this.giftcards[i]["active"]){
              for(var y = 0; y < this.giftcards[i]["availability"].length; y++){
                if(this.giftcards[i]["availability"][y] == 1){
                  const vistaGiftcard: Giftcard = {
                    nombre: this.giftcards[i]["name"],
                    imagen: this.giftcards[i]["image"],
                    id: this.giftcards[i]["id"],
                    precio: 10 + (10*this.giftcards[i]["chargeRate"]),
                    displayName: this.giftcards[i]["name"] + " - $10.00"
                  };
                  this.listaDeGiftcards.push(vistaGiftcard);
                  //console.log(vistaGiftcard.displayName);

                } else if (this.giftcards[i]["availability"][y] == 2){
                  const vistaGiftcard: Giftcard = {
                    nombre: this.giftcards[i]["name"],
                    imagen: this.giftcards[i]["image"],
                    id: this.giftcards[i]["id"],
                    precio: 25 + (25*this.giftcards[i]["chargeRate"]),
                    displayName: this.giftcards[i]["name"] + " - $25.00"
                  };
                  this.listaDeGiftcards.push(vistaGiftcard);
                  //console.log(vistaGiftcard.displayName);

                } else if (this.giftcards[i]["availability"][y] == 3){
                  const vistaGiftcard: Giftcard = {
                    nombre: this.giftcards[i]["name"],
                    imagen: this.giftcards[i]["image"],
                    id: this.giftcards[i]["id"],
                    precio: 50 + (50*this.giftcards[i]["chargeRate"]),
                    displayName: this.giftcards[i]["name"] + " - $50.00"
                  };
                  this.listaDeGiftcards.push(vistaGiftcard);
                  //console.log(vistaGiftcard.displayName);

                } else if (this.giftcards[i]["availability"][y] == 4){
                  const vistaGiftcard: Giftcard = {
                    nombre: this.giftcards[i]["name"],
                    imagen: this.giftcards[i]["image"],
                    precio: 100 + (100*this.giftcards[i]["chargeRate"]),
                    id: this.giftcards[i]["id"],
                    displayName: this.giftcards[i]["name"] + " - $100.00"
                  };
                  this.listaDeGiftcards.push(vistaGiftcard);
                  //console.log(vistaGiftcard.displayName);
                }
              }
            }
          }
        },
        error => {
          console.log(error);
        });

  }

  agregarAlCarrito(indice:string){
    Utils.carrito.push(this.listaDeGiftcards[Number(indice)]); 
    this.toastr.success('¡Añadido al carrito!', this.listaDeGiftcards[Number(indice)].displayName);
    //console.log(this.listaDeGiftcards[Number(indice)].displayName);
  }

  verCarrito(){
    this.router.navigate(['carrito']);
  }

}
