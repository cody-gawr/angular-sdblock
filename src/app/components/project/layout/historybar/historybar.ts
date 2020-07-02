import { Component, OnInit, OnDestroy, ViewChild, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd, RouterEvent } from '@angular/router';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { NbDialogService } from '@nebular/theme';
import { SubSink } from 'subsink';
import { CollectionService } from 'src/app/services/project/collection';
import { ProjectService } from 'src/app/services/project/project';
import { BreadcrumbService } from 'src/app/services/project/breadcrumb';
import { Project } from 'src/app/models/project';

@Component({
  selector: 'app-historybar',
  templateUrl: './historybar.html',
  styleUrls: ['./historybar.scss'],
})
export class HistorybarComponent implements OnInit, OnDestroy {

  @ViewChild('changeDetailDialog', { static: false }) changeDetailDialog: TemplateRef<any>;

  project: Project;
  projectID: number;
  collections: any[];
  collectionUuid: any;

  breadcrumb: any;
  historyCollection: any;
  artwork = 'assets/images/bj.png';

  // history pagination
  curPage = 1;
  pageCount = 10;
  private subs = new SubSink();

  constructor(
    private dialogService: NbDialogService,
    public projectService: ProjectService,
    public collectionService: CollectionService,
    private activatedRoute: ActivatedRoute,
    private breadcrumbService: BreadcrumbService,
    private router: Router,
  ) { }
  ngOnInit() {
    this.getData();
    this.watchBreadcrumb();
    this.watchRouter();
  }
  watchRouter() {
    this.subs.sink = this.router.events.pipe(
      filter((event: RouterEvent) => event instanceof NavigationEnd)
    ).subscribe((res) => {
      this.getData();
      this.watchBreadcrumb();
    });
  }
  watchBreadcrumb() {
    this.subs.sink = this.breadcrumbService.getBreadcrumb().subscribe(res => {
      this.breadcrumb = res;
    });
  }
  getData() {
    this.subs.sink = this.activatedRoute.params.subscribe(params => {
      this.projectID = params.id;
      // this.artwork = this.project.image;
    });
    this.subs.sink = this.projectService.watchProjectInfo().subscribe(project => {
      this.project = project;
    });
    this.subs.sink = this.projectService.watchProjectCollections().subscribe(res => {
      this.collections = res;
      this.pageCount = Math.floor((this.collections.length - 1) / 4) + 1;
    });
    this.subs.sink = this.projectService.watchCollectionUuid().subscribe(res => {
      this.collectionUuid = res;
    });
  }
  selectVersion(collection) {
    console.log({collection});
    if (this.isCurrentCollection(collection)) { return; }
    this.projectService.changeCollection(this.breadcrumb, collection.collection_uuid);
  }
  onAction(e, collection) {
    e.stopPropagation();
    this.showChangeDetail(collection);
  }
  getQueryParameter(key: string): string {
    const params = new URLSearchParams(window.location.search);
    return params.get(key) ? params.get(key) : '';
  }
  showChangeDetail(collection) {
    this.historyCollection = collection;
    this.dialogService.open(this.changeDetailDialog, {
      closeOnBackdropClick: false,
      closeOnEsc: false
    });
  }
  updateArtwork(event) {
    console.log({event});
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      this.projectService.uploadArtwork(this.projectID, file).subscribe(res => {
        console.log(res);
        this.project.project_avatar = res.project_avatar;
        this.projectService.project.next(this.project);
      });
    }
  }
  pagePrev() {
    if (this.curPage == 1) { return; }
    this.curPage --;
  }
  pageNext() {
    if (this.curPage == this.pageCount) { return; }
    this.curPage ++;
  }
  isCurrentCollection(collection) {
    if (this.collectionUuid == collection.collection_uuid) {
      return true;
    }
    return false;
  }
  closeDialog(ref) {
    ref.close();
  }
  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
