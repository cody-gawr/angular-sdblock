import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Router, NavigationEnd, RouterEvent } from '@angular/router';
import { Observable, empty } from 'rxjs';
import { NbDialogService } from '@nebular/theme';
import { SubSink } from 'subsink';

import { NotificationService } from 'src/app/services/support/notification';
import { ProjectService } from 'src/app/services/project/project';
import { ProfileService } from 'src/app/services/account/profile';
import { AuthService } from 'src/app/services/account/auth';
import { Project } from 'src/app/models/project';
import { Draft } from 'src/app/models/draft';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.page.html',
  styleUrls: ['./projects.page.scss'],
})
export class ProjectsPage implements OnInit, OnDestroy {
  private subs = new SubSink();
  projects: Observable<Project[]>;
  notesObs: Observable<any>;
  drafts: any[];
  services: any[];
  constructor(
    private dialogService: NbDialogService,
    private router: Router,
    public projectService: ProjectService,
    private profileService: ProfileService,
    private notificationService: NotificationService,
  ) { }

  ngOnInit() { }

  ionViewWillEnter() {
    this.getProjects();
    this.getDrafts();
    this.getNotes();
    this.getBasicUserServicesInfo();
  }

  getBasicUserServicesInfo() {
    this.subs.sink = this.profileService.getBasicUserServicesInfo().subscribe(res => {
      this.services = res;
    });
  }

  getProjects() {
    this.projects = this.projectService.getProjects();
  }

  getDrafts() {
    this.subs.sink = this.projectService.getDrafts().subscribe(res => {
      this.drafts = res;
    });
  }

  getNotes() {
    this.notesObs = this.notificationService.getNoteableEvents();
  }

  checkCreateProjectPermission() {
    if (!this.services) { return false; }
    for (const service of this.services) {
      for (const permission of service.permissions) {
        if (permission.permission_name == 'App.Soundblock.Service.Project.Create' && permission.permission_value) {
          return true;
        }
      }
    }
    return false;
  }

  openProject(project) {
    this.router.navigate(['/project/', project.project_uuid]);
  }

  newProject() {
    const newDraft = new Draft();
    this.projectService.projectDraft.next(newDraft);
    this.router.navigate(['project/create/1']);
  }

  openDraft(draft) {
    const projectDraft = new Draft().deserialize({
      service: draft.service.data,
      draft: draft.draft_uuid,
      step: draft.step,
      payment: draft.draft_json.payment,
      project: draft.draft_json.project,
    });
    this.projectService.projectDraft.next(projectDraft);
    this.router.navigate([`project/create/1`]);
  }

  openDialog(ref: any, context?) {
    if (context) {
      return this.dialogService.open(ref, {
        closeOnBackdropClick: false,
        closeOnEsc: false,
        context
      }).onClose;
    } else {
      this.dialogService.open(ref, {
        closeOnBackdropClick: false,
        closeOnEsc: false,
      });
    }
  }

  ionViewWillLeave() {
    this.projects = empty();
    this.subs.unsubscribe();
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
