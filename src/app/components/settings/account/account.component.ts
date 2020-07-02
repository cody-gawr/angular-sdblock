import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SubSink } from 'subsink';
import { Observable } from 'rxjs';

import { ProfileService } from 'src/app/services/account/profile';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
})
export class AccountComponent implements OnInit, OnDestroy {
  private subs = new SubSink();
  accountObservable: Observable<any>;
  page = 'Account';
  constructor(
    private profileService: ProfileService,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.watchAccountPage();
    this.getData();
  }

  watchAccountPage() {
    this.subs.sink = this.activatedRoute.queryParams.subscribe(queryParams => {
      if (queryParams.page) {
        this.page = queryParams.page;
      }
    });
  }

  getData() {
    this.accountObservable = this.profileService.getAccount();
  }

  setPage(page) {
    this.page = page;
  }

  onUpgrade() {
    this.page = 'Account';
    this.getData();
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
