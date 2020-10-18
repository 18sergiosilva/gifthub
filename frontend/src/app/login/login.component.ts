import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Location } from '@angular/common';

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
    this.http.post('http://35.239.230.8:5000/usuario/' + this.correo,
        {

        }).toPromise().then((data: any) => {
          console.log(data);
        });
  }
  cancelar() {
    this.correo = '';
    this.contra = '';
  }

}
