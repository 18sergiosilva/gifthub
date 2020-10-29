import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { from } from 'rxjs';

import { HomeComponent } from './home/home.component';
import { ModificarComponent } from './modificar/modificar.component'
import { VistaGiftcardsComponent } from './vista-giftcards/vista-giftcards.component'
import { RegistrarseComponent } from './registrarse/registrarse.component';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'modificar/:id', component: ModificarComponent },
  { path: 'giftcards', component: VistaGiftcardsComponent },
  { path: 'home', component: HomeComponent },
  { path: 'registrarse', component: RegistrarseComponent },
  { path: 'login', component: LoginComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
