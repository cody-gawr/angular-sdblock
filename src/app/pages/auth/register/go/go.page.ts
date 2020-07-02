import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ProjectService } from 'src/app/services/project/project';
import { Draft } from 'src/app/models/draft';
import { SubSink } from 'subsink';

import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-go',
  templateUrl: './go.page.html',
  styleUrls: ['./go.page.scss'],
})
export class GoPage implements OnInit, OnDestroy {
  private subs = new SubSink();

  type = '';
  confirm = '';
  
  assetUrl = environment.fileUrl;
  
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public projectService: ProjectService,
  ) { }
    
  ngOnInit() {
    this.watchQueryParams();
  }

  watchQueryParams() {
    this.subs.sink = this.activatedRoute.queryParams.subscribe(queryParams => {
      this.type = queryParams.plan;
      this.confirm = queryParams.confirm;
    });
  }

  createProject() {
    this.projectService.projectDraft.next(new Draft());
    this.router.navigate(['project/create/1']);
  }
  onFinish() {
    this.router.navigate(['/home']);
  }
  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
