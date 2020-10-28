import { TestBed } from '@angular/core/testing';

import { ServicioVistaGiftcardsService } from './servicio-vista-giftcards.service';

describe('ServicioVistaGiftcardsService', () => {
  let service: ServicioVistaGiftcardsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServicioVistaGiftcardsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
