import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-tabheader',
  templateUrl: './tabheader.html',
  styleUrls: ['./tabheader.scss'],
})
export class TabheaderComponent implements OnInit, OnDestroy {
  @Input() tab: string;
  private subs = new SubSink();
  projectID: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.watchProjectID();
  }

  watchProjectID() {
    this.subs.sink = this.activatedRoute.params.subscribe(params => {
      this.projectID = params.id;
    });
  }

  navigate(url = '') {
    this.router.navigate([`/project/${this.projectID}/${url}`]);
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
