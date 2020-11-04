import { Component, DoCheck, OnInit } from '@angular/core';
import { Utils } from '../utils/utils';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit, DoCheck {
  constructor() { }
  indices = Utils.indices;

  ngOnInit() {
  }

  ngDoCheck() {
    this.indices = Utils.indices;
  }

}
