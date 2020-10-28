import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VistaGiftcardsComponent } from './vista-giftcards.component';

describe('VistaGiftcardsComponent', () => {
  let component: VistaGiftcardsComponent;
  let fixture: ComponentFixture<VistaGiftcardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VistaGiftcardsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VistaGiftcardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
