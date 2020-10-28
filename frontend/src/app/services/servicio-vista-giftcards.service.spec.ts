import { TestBed } from '@angular/core/testing';

import { ServicioVistaGiftcardsService } from './servicio-vista-giftcards.service';

describe('ServicioVistaGiftcardsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ServicioVistaGiftcardsService = TestBed.get(ServicioVistaGiftcardsService);
    expect(service).toBeTruthy();
  });
});
