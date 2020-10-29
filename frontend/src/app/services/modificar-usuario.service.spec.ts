import { TestBed } from '@angular/core/testing';

import { ModificarUsuarioService } from './modificar-usuario.service';

describe('ModificarUsuarioService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ModificarUsuarioService = TestBed.get(ModificarUsuarioService);
    expect(service).toBeTruthy();
  });
});
