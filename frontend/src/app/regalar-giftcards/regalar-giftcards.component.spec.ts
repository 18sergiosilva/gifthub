import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { Router, Routes } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { RegalarGiftcardsComponent } from './regalar-giftcards.component';
import { Giftcard2 } from "../models/modelos";
import { FormsModule } from '@angular/forms';

describe('RegalarGiftcardsComponent', () => {
  let component: RegalarGiftcardsComponent;
  let fixture: ComponentFixture<RegalarGiftcardsComponent>;
  let router: Router;
  localStorage.setItem('logued', '1');
  
  const routes: Routes = [
    { path: 'regalar', component: RegalarGiftcardsComponent }
  ];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, RouterTestingModule.withRoutes(routes), FormsModule],
      declarations: [ RegalarGiftcardsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegalarGiftcardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /*
  it("Debe retornar impreso al llamar al metodo imprimirError", async(() => {
    //expect(component.regalarGiftcard()).toBe(false);
  }));

  it("Debe retornar falso al momento de regalar una tarjeta vacia", async(() => {
    //expect(component.imprimirError("miError")).toContain("impreso");
  }));
  it("Debe retornar la disponibilidad de una tarjeta", async(() => {
    const vistaGiftcard: Giftcard2 = {
      nombre: "minombre",
      imagen: "miimagen",
      precio: 100,
      id: 1,
      displayName: "displayName",
      availability: "1",
      alfanumerico : "BHNqGwmq",
    };
    component.giftcards.push(vistaGiftcard);
    expect(component.disponibilidad(0)).toContain("1");
  }));

  it("Debe retornar la longitud del arreglo de giftcards", async(() => {
    /*const vistaGiftcard: Giftcard2 = {
      nombre: "minombre",
      imagen: "miimagen",
      precio: 100,
      id: 1,
      displayName: "displayName",
      availability: "1",
      alfanumerico : "BHNqGwmq",
    };
    component.giftcards.push(vistaGiftcard);
    expect(component.longitud()).toBeGreaterThan(0);
  
  }));


  it("Debe retornar verdadero al agregar 1 giftcard", async(() => {
    /*const vistaGiftcard: Giftcard2 = {
      nombre: "minombre",
      imagen: "miimagen",
      precio: 100,
      id: 1,
      displayName: "displayName",
      availability: "1",
      alfanumerico : "BHNqGwmq",
    };
    component.giftcards.push(vistaGiftcard);
    expect(component.agregarGiftcard(vistaGiftcard)).toBeTrue();

  }));



  it("Debe retornar la longitud del arreglo de giftcards a regalar", async(() => {
    const vistaGiftcard: Giftcard2 = {
      nombre: "minombre",
      imagen: "miimagen",
      precio: 100,
      id: 1,
      displayName: "displayName",
      availability: "1",
      alfanumerico : "BHNqGwmq",
    };
    component.listaDeGiftcards.push(vistaGiftcard);
    expect(component.longitud2()).toBeGreaterThan(0);
  }));

  it("Debe retornar el nombre display de una tarjeta", async(() => {
    const vistaGiftcard: Giftcard2 = {
      nombre: "minombre",
      imagen: "miimagen",
      precio: 100,
      id: 1,
      displayName: "displayName",
      availability: "1",
      alfanumerico : "BHNqGwmq",
    };
    component.listaDeGiftcards.push(vistaGiftcard);
    expect(component.getDisplay(0)).toContain("displayName");
  }));

  */
});
