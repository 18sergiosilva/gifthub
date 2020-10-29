import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { from } from 'rxjs';

import { HomeComponent } from './home/home.component';
import { ModificarComponent } from './modificar/modificar.component'
import { VistaGiftcardsComponent } from './vista-giftcards/vista-giftcards.component'
import { RegistrarseComponent } from './registrarse/registrarse.component';
import { RegalarGiftcardsComponent } from './regalar-giftcards/regalar-giftcards.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'modificar', component: ModificarComponent },
  { path: 'giftcards', component: VistaGiftcardsComponent },
  { path: 'home', component: HomeComponent },
  { path: 'registrarse', component: RegistrarseComponent },
  { path: 'regalar', component: RegalarGiftcardsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
