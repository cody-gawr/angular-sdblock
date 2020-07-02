import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { SubSink } from 'subsink';
import { Project } from 'src/app/models/project';
import { ChartService } from 'src/app/services/contract/chart';
import { ProjectService } from 'src/app/services/project/project';
import { Draft } from 'src/app/models/draft';

@Component({
  selector: 'app-done',
  templateUrl: './done.page.html',
  styleUrls: ['./done.page.scss'],
})
export class DonePage implements OnInit, OnDestroy {
  private subs = new SubSink();
  projectDraft = new Draft();
  payment: any;
  tracks = [];
  constructor(
    private router: Router,
    private projectService: ProjectService,
  ) { }

  ngOnInit() {
    this.watchProjectDraft();
  }

  watchProjectDraft() {
    this.subs.sink = this.projectService.watchProjectDraft().subscribe(res => {
      this.projectDraft = res;
      console.log('draft', this.projectDraft);
    });
  }

  navigate(step: number) {
    this.router.navigate([`/project/create/${step}`]);
  }

  edit(step: number) {
    this.router.navigate([`/project/create/${step}`], {
      queryParams: { returnUrl: true }
    });
  }

  saveDraft() {
    const req = {
      step: 1,
      draft: this.projectDraft.draft,
      service: this.projectDraft.service.service_uuid,
      ...this.projectDraft.project,
      ...this.projectDraft.payment.custom_contract_rules,
    };
    this.subs.sink = this.projectService.saveDraft(req).subscribe(res => {
      this.router.navigate([`/home/`]);
    });
  }

  onBtnSubmit() {
    const date = new Date(this.projectDraft.project.project_date);
    const req = {
      service: this.projectDraft.service.service_uuid,
      ...this.projectDraft.project,
      project_date: `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`,
      artwork_url: this.projectDraft.project.project_avatar,
    };
    this.subs.sink = this.projectService.createProject(req).subscribe(res => {
      this.router.navigate([`/home`]);
    });
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
