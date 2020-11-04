import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Location } from '@angular/common';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private router: Router, private http: HttpClient, private location: Location) { }
  correo: string;
  contra: string;

  ngOnInit() {
  }
  entrar() {

    this.http.post('http://35.239.230.8:5000/login',
      {
        'userOMail': this.correo,
        'pass': this.contra
      }).subscribe((data: any) => {
        localStorage.setItem('user', this.correo);
        this.router.navigate(['home']);
      },
        (error: HttpErrorResponse) => {
          this.cancelar();
        });
  }
  
  cancelar() {
    this.correo = '';
    this.contra = '';
  }

}
