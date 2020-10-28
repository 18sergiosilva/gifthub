import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { Router, Routes } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { VistaGiftcardsComponent } from './vista-giftcards.component';
import { ToastrModule } from 'ngx-toastr';

describe('VistaGiftcardsComponent', () => {
  let component: VistaGiftcardsComponent;
  let fixture: ComponentFixture<VistaGiftcardsComponent>;
  let router: Router;
  
  const routes: Routes = [
    { path: 'giftcards', component: VistaGiftcardsComponent }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientModule, RouterTestingModule.withRoutes(routes),ToastrModule.forRoot()],
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
