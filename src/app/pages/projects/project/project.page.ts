import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { SubSink } from 'subsink';

import { BreadcrumbService } from 'src/app/services/project/breadcrumb';
import { CollectionService } from 'src/app/services/project/collection';
import { ProjectService } from 'src/app/services/project/project';
import { PanelService } from 'src/app/services/shared/panel';

import { Project } from 'src/app/models/project';
import { BreadcrumbItem } from 'src/app/models/breadcrumbItem';
import { HistorydialogComponent } from 'src/app/components/project/dialog/historydialog/historydialog.component';

import * as _ from 'lodash';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-project',
  templateUrl: './project.page.html',
  styleUrls: ['./project.page.scss'],
})
export class ProjectPage implements OnInit, OnDestroy {
  private subs = new SubSink();
  projectInfo: Project;
  contractObs: Observable<any>;
  collectionUuid: any;
  tracks: any;
  checkedList: any;

  currentTab: string;
  breadcrumb: BreadcrumbItem[] = [];

  path: string;
  currentUrl: string;
  projectID: number;
  
  sidebar: any;
  content: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private modalController: ModalController,
    private router: Router,
    public breadcrumbService: BreadcrumbService,
    public collectionService: CollectionService,
    public projectService: ProjectService,
    private panelService: PanelService,
  ) { }

  ngOnInit() {
    this.subs.sink = this.activatedRoute.data.subscribe((data: any) => {
      this.projectInfo = data[0];
      console.log(this.projectInfo);
      this.projectService.setProjectInfo(data[0]);
      this.watchProjectInfo();
      this.getContractData();
      this.watchCurrentTab();
      this.watchBreadcrumb();
      this.watchParams();
    });
  }

  getElements() {
    this.sidebar = document.getElementById('rootContent').getElementsByClassName('sidemenu');
  }

  watchProjectInfo() {
    this.subs.sink = this.projectService.watchCollectionUuid().subscribe(res => {
      this.collectionUuid = res;
    });
    this.subs.sink = this.projectService.watchProjectTracks().subscribe(res => {
      this.tracks = res;
    });
    this.subs.sink = this.collectionService.watchCheckedList().subscribe(res => {
      this.checkedList = res;
    });
  }

  getContractData() {
    this.contractObs = this.projectService.getProjectContract(this.projectInfo.project_uuid);
  }

  watchBreadcrumb() {
    this.subs.sink = this.breadcrumbService.getBreadcrumb().subscribe(res => {
      this.breadcrumb = res;
    });
  }

  watchCurrentTab() {
    this.subs.sink = this.collectionService.watchCurrentTab().subscribe(res => {
      this.currentTab = res;
      if (!res) { this.currentTab = 'Info'; }
    });
  }

  watchParams() {
    this.subs.sink = this.activatedRoute.queryParams.subscribe(queryParams => {
      this.updateCollectionItems(queryParams.version, queryParams.path);
    });
    this.subs.sink = this.activatedRoute.params.subscribe(routeParams => {
      this.projectID = routeParams.id;
    });
  }

  updateCollectionItems(collectionUuid, collectionPath) {
    if (!collectionUuid && !collectionPath) {
      this.breadcrumbService.initBreadcrumb();
      this.collectionService.setCurrentTab('Info');
      return;
    }
    if (!collectionUuid || !collectionPath) {
      this.router.navigate([]);
    }
    // set collection Uuid
    this.projectService.collectionUuid.next(collectionUuid);
    // parse tab and breadcrumb
    const pathParams = collectionPath.split('/').filter(value => value != '');
    // set tab
    if (pathParams[0] == 'Info') {
      this.router.navigate([]);
    }
    if (pathParams[0]) {
      this.collectionService.setCurrentTab(pathParams[0]);
    }
    // set breadcrumb
    this.breadcrumbService.initBreadcrumb();
    pathParams.forEach(element => {
      this.breadcrumbService.addBreadcrumbItem({ name: element });
    });
    this.collectionService.updateDataWithBreadcrumb(this.breadcrumb, collectionUuid);
  }

  setCollectionSection(title) {
    if (!this.collectionUuid) {
      // this.notificationService.showWarning('Collection', 'Please upload files');
      return;
    }
    this.collectionService.setCurrentTab(title);
    this.currentTab = title;
    if (title == 'Info') {
      this.router.navigate([]);
      return;
    }
    if (!this.breadcrumb.length || this.breadcrumb[0].name != title) {
      this.breadcrumbService.initBreadcrumb(title);
      this.router.navigate([], { queryParams: { version: this.collectionUuid, path: title } });
    }
  }

  uploadFiles() {
  }

  showHistoryBar() {
    this.panelService.showHistoryBar();
  }

  async showHistoryDialog() {
    const modal = await this.modalController.create({
      component: HistorydialogComponent
    });
    return await modal.present();
  }

  ionViewWillLeave() {
    this.projectInfo = new Project();
    this.collectionUuid = '';
    this.tracks = [];
    this.currentTab = 'Info';
    this.projectService.initData();
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
