import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { Router, Routes } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { InventarioGiftcardsComponent } from './inventario-giftcards.component';
import { Giftcard3 } from "../models/modelos";

describe('InventarioGiftcardsComponent', () => {
  let component: InventarioGiftcardsComponent;
  let fixture: ComponentFixture<InventarioGiftcardsComponent>;
  let router: Router;

  const routes: Routes = [
    { path: 'inventario', component: InventarioGiftcardsComponent }
  ];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, RouterTestingModule.withRoutes(routes)],
      declarations: [ InventarioGiftcardsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InventarioGiftcardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it("Debe retornar impreso al llamar al metodo imprimirError", async(() => {
    expect(component.imprimirError("miError")).toContain("impreso");
  }));

  it("Debe retornar la disponibilidad de una tarjeta", async(() => {
    const vistaGiftcard: Giftcard3 = {
      nombre: "minombre",
      imagen: "miimagen",
      precio: 100,
      id: 1,
      displayName: "displayName",
      availability: "1",
      cantidad : 1,
    };
    component.giftcards.push(vistaGiftcard);
    expect(component.disponibilidad(0)).toContain("1");
  }));

  it("Debe retornar la longitud del arreglo de giftcards", async(() => {
    const vistaGiftcard: Giftcard3 = {
      nombre: "minombre",
      imagen: "miimagen",
      precio: 100,
      id: 1,
      displayName: "displayName",
      availability: "1",
      cantidad : 1,
    };
    component.giftcards.push(vistaGiftcard);
    expect(component.longitud()).toBeGreaterThan(0);
  }));


  it("Debe retornar verdadero al agregar 1 giftcard", async(() => {
    const vistaGiftcard: Giftcard3 = {
      nombre: "minombre",
      imagen: "miimagen",
      precio: 100,
      id: 1,
      displayName: "displayName",
      availability: "1",
      cantidad : 1,
    };
    component.giftcards.push(vistaGiftcard);
    expect(component.agregarGiftcard(vistaGiftcard)).toBeTrue();
  }));

});
