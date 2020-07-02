import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { SubSink } from 'subsink';

import { SharedService } from 'src/app/services/shared/shared';
import { ChartService } from 'src/app/services/contract/chart';
import { ProfileService } from 'src/app/services/account/profile';
import { ProjectService } from 'src/app/services/project/project';

import { Draft, Payout } from 'src/app/models/draft';

import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-project',
  templateUrl: './project.page.html',
  styleUrls: ['./project.page.scss'],
})
export class ProjectPage implements OnInit, OnDestroy {
  private subs = new SubSink();
  projectDraft = new Draft();
  form: FormGroup;

  // Project
  serviceAccount: any;
  services: any[];

  draftSaved = false;
  submitted: boolean;
  returnUrl: any;

  genres: any[] = [ { name: 'Rock', selected: false }, { name: 'Heavy Metal', selected: false },
    { name: 'Jazz', selected: false }, { name: 'Blues', selected: false }];
  roles: any = ['Admin', 'Band Member', 'Booking Agent', 'Composer', 'Designer', 'Investor', 'Label', 'Lawyer', 'Manager',
    'Owner', 'Publisher', 'Writer', '(Other)'];
  types: any[] = ['Album', 'EP', 'Solo'];

  artworkPath = `${environment.fileUrl}/images/album2.png`;

  constructor(
    public sharedService: SharedService,
    private activatedRoute: ActivatedRoute,
    private profileService: ProfileService,
    private projectService: ProjectService,
    private router: Router,
    public _FB: FormBuilder
  ) { }

  ngOnInit() {
    this.watchReturnUrl();
    this.getBasicUserServicesInfo();
    this.watchProjectDraft();
  }

  getBasicUserServicesInfo() {
    this.subs.sink = this.profileService.getBasicUserServicesInfo().subscribe(res => {
      this.services = res.filter(service => this.checkCreateProjectPermission(service));
      this.watchProjectDraft();
    });
  }

  checkCreateProjectPermission(service) {
    for (const permission of service.permissions) {
      if (permission.permission_name == 'App.Soundblock.Service.Project.Create' && permission.permission_value) {
        return true;
      }
    }
    return false;
  }

  watchProjectDraft() {
    this.subs.sink = this.projectService.watchProjectDraft().subscribe(res => {
      this.projectDraft = res;
      this.updateData();
    });
  }

  watchReturnUrl() {
    if (this.activatedRoute.snapshot.queryParams.returnUrl) {
      this.returnUrl = JSON.parse(this.activatedRoute.snapshot.queryParams.returnUrl);
    } else {
      this.returnUrl = false;
    }
  }

  uploadArtwork(event, form) {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const serviceUuid = this.projectDraft.service.service_uuid;
      if (serviceUuid == '') {
        return;
      }
      this.subs.sink = this.projectService.uploadDraftArtwork(file, serviceUuid, this.projectDraft.draft).subscribe(res => {
        this.artworkPath = res.url;
        this.projectDraft.project.project_avatar = res.url;
      });
    }
  }

  selectService(service) {
    this.projectDraft.service = service.service;
  }

  updateData() {
    this.form = this._FB.group({
      service: ['', Validators.required],
      title: ['', Validators.required],
      type: ['', Validators.required],
      releaseDate: ['', Validators.required],
      genre: [''],
    });

    if (this.projectDraft.project) {
      this.f.service.setValue(this.projectDraft.service.service_name);
      this.f.title.setValue(this.projectDraft.project.project_title);
      this.f.type.setValue(this.projectDraft.project.project_type);
      this.f.releaseDate.setValue(this.projectDraft.project.project_date);
    }
  }

  onSubmit(form) {
    console.log({form});
    if (!this.form.valid) {
      return;
    }
    this.projectService.projectValid = true;
    this.saveProjectStatus();

    const req = {
      step: 1,
      draft: this.projectDraft.draft,
      service: this.projectDraft.service.service_uuid,
      ...this.projectDraft.project,
    };
    this.subs.sink = this.projectService.saveDraft(req).subscribe(res => {
      this.router.navigate([`/project/create/2`]);
    });
  }
  saveDraft(form) {
    const req = {
      step: 1,
      draft: this.projectDraft.draft,
      service: this.projectDraft.service.service_uuid,
      ...this.projectDraft.project,
    };
    this.subs.sink = this.projectService.saveDraft(req).subscribe(res => {
      this.router.navigate([`/home/`]);
    });
  }
  get f(): any {
    return this.form.controls;
  }

  saveProjectStatus() {
    this.projectDraft.project.project_title = this.f.title.value;
    this.projectDraft.project.project_type = this.f.type.value;
    this.projectDraft.project.project_date = this.f.releaseDate.value;
  }

  navigatePage(url: string, queryParams?) {
    console.log({url});
    this.router.navigate([`/${url}`], {queryParams});
  }
  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
