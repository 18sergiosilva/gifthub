import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { Router, Routes } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { InventarioGiftcardsComponent } from './inventario-giftcards.component';

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
});
