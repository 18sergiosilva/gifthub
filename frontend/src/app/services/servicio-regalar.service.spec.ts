import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { ServicioRegalarService } from './servicio-regalar.service';
import { Router, Routes } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

describe('ServicioRegalarService', () => {

  let router: Router;
  
  const routes: Routes = [
    { path: 'usuario/:id', component: ServicioRegalarService }
  ];

  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientModule, RouterTestingModule.withRoutes(routes)],
  }));

  it('should be created', () => {
    const service: ServicioRegalarService = TestBed.get(ServicioRegalarService);
    expect(service).toBeTruthy();
  });
});
