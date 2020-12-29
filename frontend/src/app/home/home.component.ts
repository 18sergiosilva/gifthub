import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Utils } from '../utils/utils';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private router: Router, private http: HttpClient) { }
  cadena: any;

  ngOnInit() {
    if (localStorage.getItem('logued') !== '1') {
      localStorage.setItem('logued', '0');
      this.router.navigate(['login']);
    }
  }

}
