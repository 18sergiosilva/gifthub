import { ServicioVistaGiftcardsService } from './servicio-vista-giftcards.service';
import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { Router, Routes } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {HttpErrorResponse} from '@angular/common/http';
import { ACTUALIZACION, PROPIABASE } from '../mockData'

describe('ServicioVistaGiftcardsService', () => {

  let router: Router;
  let coursesService: ServicioVistaGiftcardsService;
  let httpTestingController: HttpTestingController;
  
  const routes: Routes = [
    { path: 'cards', component: ServicioVistaGiftcardsService },
    { path: 'cards/mongo', component: ServicioVistaGiftcardsService }
  ];

  beforeEach(() => {TestBed.configureTestingModule({
    imports: [HttpClientModule, RouterTestingModule.withRoutes(routes),  HttpClientTestingModule],
    providers: [ServicioVistaGiftcardsService]
  })

  coursesService = TestBed.get(ServicioVistaGiftcardsService),
  httpTestingController = TestBed.get(HttpTestingController);

});

  it('should be created', () => {
    const service: ServicioVistaGiftcardsService = TestBed.get(ServicioVistaGiftcardsService);
    expect(service).toBeTruthy();
  });


  it('Debe actualizar la bd con las giftcards', () => {

    coursesService.actualizarGiftcards()
        .subscribe(courses => {

            expect(courses["message"]).toContain("giftcards actualizadas desde mock");

        });

    const req = httpTestingController.expectOne('http://35.239.230.8:5000/cards');

    expect(req.request.method).toEqual("GET");

    req.flush(ACTUALIZACION);

  });



  it('Debe obtener las giftcards desde nuestra base', () => {

    coursesService.getGiftcardsLocales()
        .subscribe(courses => {

            expect(courses["message"]).toContain("Se devolvieron las giftcards desde mock");

        });

    const req = httpTestingController.expectOne('http://35.239.230.8:5000/cards/mongo');

    expect(req.request.method).toEqual("GET");

    req.flush(PROPIABASE);

  });





});
