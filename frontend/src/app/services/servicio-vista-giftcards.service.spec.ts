import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { ServicioVistaGiftcardsService } from './servicio-vista-giftcards.service';
import { Router, Routes } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

describe('ServicioVistaGiftcardsService', () => {

  let router: Router;
  
  const routes: Routes = [
    { path: 'cards', component: ServicioVistaGiftcardsService },
    { path: 'cards/mongo', component: ServicioVistaGiftcardsService }
  ];

  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientModule, RouterTestingModule.withRoutes(routes)],
  }));

  it('should be created', () => {
    const service: ServicioVistaGiftcardsService = TestBed.get(ServicioVistaGiftcardsService);
    expect(service).toBeTruthy();
  });
});
