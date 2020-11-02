import { ServicioRegalarService } from './servicio-regalar.service';
import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import { Router, Routes } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import {HttpErrorResponse} from '@angular/common/http';
import { DATOS, REGALO } from '../mockData'

describe('ServicioRegalarService', () => {

  let router: Router;
  let coursesService: ServicioRegalarService;
  let httpTestingController: HttpTestingController;
  
  const routes: Routes = [
    { path: 'usuario/:id', component: ServicioRegalarService }
  ];

  beforeEach(() => {TestBed.configureTestingModule({
    imports: [HttpClientModule, RouterTestingModule.withRoutes(routes), HttpClientTestingModule],
    providers: [ServicioRegalarService]
  })

  coursesService = TestBed.get(ServicioRegalarService),
  httpTestingController = TestBed.get(HttpTestingController);

});

  it('should be created', () => {
    const service: ServicioRegalarService = TestBed.get(ServicioRegalarService);
    expect(service).toBeTruthy();
  });



  it('Debe retornar un usuario encontrado', () => {

    coursesService.obtenerGiftcards("MKJLW")
        .subscribe(courses => {

            expect(courses).toBeTruthy('No se encontro el usuario');
            console.log(courses);

            expect(courses["message"]).toContain("Usuario encontrado desde mock");

        });

    const req = httpTestingController.expectOne('http://35.239.230.8:5000/usuario/MKJLW');

    expect(req.request.method).toEqual("GET");

    req.flush(DATOS);

  });


  it('Debe regalar una tarjeta', () => {

    coursesService.regalarTarjeta("BBCCI","MKJLW",1,"1","BHNqGwmq")
        .subscribe(courses => {

            expect(courses).toBeTruthy('No se pudo regalar la tarjeta');
            console.log(courses);

            expect(courses["message"]).toContain("Tarjeta regalada con exito desde mock");

        });

    const req = httpTestingController.expectOne('http://35.239.230.8:5000/regalar');

    expect(req.request.method).toEqual("POST");

    req.flush(REGALO);

  });

});
