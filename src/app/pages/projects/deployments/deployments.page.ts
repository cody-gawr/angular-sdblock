import { Component, OnInit, OnDestroy, TemplateRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SubSink } from 'subsink';
import { NbDialogService } from '@nebular/theme';
import { ProjectService } from 'src/app/services/project/project';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-deployments',
  templateUrl: './deployments.page.html',
  styleUrls: ['./deployments.page.scss'],
})
export class DeploymentsPage implements OnInit, OnDestroy {
  @ViewChild('deployDialog', { static: false }) deployDialog: TemplateRef<any>;

  private subs = new SubSink();
  projectID: number;
  deployObs: Observable<any>;

  platforms = [];
  platform: string;
  agreed = false;
  constructor(
    private activatedRoute: ActivatedRoute,
    private dialogService: NbDialogService,
    private router: Router,
    public projectService: ProjectService,
  ) { }

  ngOnInit() {
    this.getPlatforms();
    this.getDeploys();
  }
  
  getPlatforms() {
    this.subs.sink = this.projectService.getPlatforms().subscribe(res => {
      console.log({res});
      this.platforms = res;
    });
  }

  getDeploys() {
    this.projectID = this.activatedRoute.snapshot.params.id;
    this.deployObs = this.projectService.getDeploy(this.projectID);
  }

  deployProject(ref) {
    this.subs.sink = this.projectService.deployProject(this.projectID, this.platform).subscribe(res => {
      this.deployObs = this.projectService.getDeploy(this.projectID);
      ref.close();
    });
  }

  showDeployDialog() {
    this.dialogService.open(this.deployDialog, {
      closeOnBackdropClick: false,
      closeOnEsc: false
    });
  }
  closeDialog(ref) {
    ref.close();
    this.platform = '';
  }
  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
