import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private http: HttpClient) { }
  cadena: any;

  ngOnInit() {
    this.cadena = 'Si lees esto no funciono :(';
    console.log(window.location.hostname);

    this.http.get(`http://${window.location.hostname}:5000/`)
      .toPromise().then((data: any) => {
        this.cadena = data;
      });
  }

}
