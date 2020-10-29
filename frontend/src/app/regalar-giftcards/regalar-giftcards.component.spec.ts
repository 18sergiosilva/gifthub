import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { Router, Routes } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { RegalarGiftcardsComponent } from './regalar-giftcards.component';

describe('RegalarGiftcardsComponent', () => {
  let component: RegalarGiftcardsComponent;
  let fixture: ComponentFixture<RegalarGiftcardsComponent>;
  let router: Router;

  const routes: Routes = [
    { path: 'regalar', component: RegalarGiftcardsComponent }
  ];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, RouterTestingModule.withRoutes(routes)],
      declarations: [ RegalarGiftcardsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegalarGiftcardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

});
