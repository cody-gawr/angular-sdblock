import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd, RouterEvent } from '@angular/router';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage implements OnInit, OnDestroy {
  private subs = new SubSink();
  drafts = [];
  constructor(
    private router: Router,
  ) { }
  ngOnInit() { }
  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
