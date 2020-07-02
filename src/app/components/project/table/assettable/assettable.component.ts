import { Component, OnInit, OnDestroy } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { SubSink } from 'subsink';

import { CollectionService } from 'src/app/services/project/collection';
import { BreadcrumbService } from 'src/app/services/project/breadcrumb';
import { BreadcrumbItem } from 'src/app/models/breadcrumbItem';
import { ProjectService } from 'src/app/services/project/project';
import { FileTransferService } from 'src/app/services/project/filetransfer';
import { SharedService } from 'src/app/services/shared/shared';

import { FilehistoryComponent } from 'src/app/components/project/dialog/filehistory/filehistory.component';
import { OrganizeComponent } from 'src/app/components/project/dialog/collection/organize/organize.component';
import { FolderComponent } from 'src/app/components/project/dialog/collection/folder/folder.component';
import { UploadComponent } from 'src/app/components/project/dialog/collection/upload/upload.component';
import { ConfirmComponent } from 'src/app/components/project/dialog/collection/confirm/confirm.component';
import { DetailComponent } from 'src/app/components/project/dialog/collection/detail/detail.component';
import { SummaryComponent } from 'src/app/components/project/dialog/collection/summary/summary.component';
import { QueuedialogComponent } from 'src/app/components/project/dialog/collection/queuedialog/queuedialog.component';
import { BlockchainComponent } from 'src/app/components/project/dialog/blockchain/blockchain.component';

import * as _ from 'lodash';

@Component({
  selector: 'app-assettable',
  templateUrl: './assettable.component.html',
  styleUrls: ['./assettable.component.scss'],
})
export class AssettableComponent implements OnInit, OnDestroy {
  private subs = new SubSink();
  projectId: any;
  breadcrumb: BreadcrumbItem[] = [];
  currentTab: string;
  curItemList: any;
  collectionUuid: any;
  tracks: any;

  columns: any;
  checkArray = [];
  checkAll: boolean;
  expandStatus = [];
  checkedList: any;

  uploadFiles: any;
  steps = [];
  stepIndex = 0;
  addedFiles = [];
  changes: any;
  discards: any;
  isZip = 0;

  trackCols = [];
  videoCols = [];
  merchCols = [];
  otherCols = [];

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private dialogService: NbDialogService,
    private projectService: ProjectService,
    public collectionService: CollectionService,
    private uploadService: FileTransferService,
    public breadcrumbService: BreadcrumbService,
    public sharedService: SharedService,
    private modalController: ModalController
  ) { }

  ngOnInit() {
    this.initialize();
    this.watchBreadcrumb();
    this.getData();
  }
  initialize() {
    this.trackCols = [{name: 'Track', size: 1}, {name: 'Title', size: 3}, {name: 'ISRC', size: 3},
      {name: 'Date', size: 2}, {name: 'Info', size: 0.5}, {name: 'Actions', size: 2}];
    this.videoCols = [{name: 'File', size: 3.5}, {name: 'Track', size: 2}, {name: 'ISRC', size: 2},
      {name: 'Date', size: 1.5}, {name: 'Info', size: 0.5}, {name: 'Actions', size: 2}];
    this.merchCols = [{name: 'File', size: 3.5}, {name: 'SKU', size: 2}, {name: 'Date', size: 3},
      {name: 'Info', size: 1},{name: 'Actions', size: 2}];
    this.otherCols = [{name: 'File', size: 4}, {name: 'Date', size: 3.5}, {name: 'Info', size: 1},
      {name: 'Actions', size: 3}];
  }
  watchBreadcrumb() {
    this.subs.sink = this.breadcrumbService.getBreadcrumb().subscribe(res => {
      this.breadcrumb = res;
    });
  }
  getData() {
    this.projectId = this.activatedRoute.snapshot.params.id;
    this.subs.sink = this.collectionService.watchCurrentTab().subscribe(res => {
      this.currentTab = res;
      this.updateData();
    });
    this.subs.sink = this.collectionService.watchCurItemList().subscribe(res => {
      if (!res) { return; }
      this.curItemList = res;
      this.updateColumnStatus();
    });
    this.subs.sink = this.collectionService.watchCheckedList().subscribe(res => {
      this.checkedList = res;
    });
    this.subs.sink = this.projectService.watchCollectionUuid().subscribe(res => {
      this.collectionUuid = res;
    });
    this.subs.sink = this.projectService.watchProjectTracks().subscribe(res => {
      this.tracks = res;
    });
  }
  updateData() {
    switch (this.currentTab) {
      case 'Music':
        this.columns = this.trackCols;
        break;
      case 'Video':
        this.columns = this.videoCols;
        break;
      case 'Merch':
        this.columns = this.merchCols;
        break;
      case 'Other':
        this.columns = this.otherCols;
        break;
    }
    this.resetData();
  }
  updateColumnStatus() {
    const files = this.curItemList.files;
    this.checkArray = new Array(files.length).fill(false);
    this.expandStatus = new Array(files.length).fill(false);
    this.checkAll = true;
    for (let i = 0; i < files.length; i ++) {
      this.checkArray[i] = this.collectionService.isFileChecked(files[i]);
      if (!this.checkArray[i]) {
        this.checkAll = false;
      }
    }
  }
  onHistory(event, file) {
    event.stopPropagation();
    this.showIonModal(FilehistoryComponent, {
      history: file.file_history
    });
  }
  onDownload(event, file?) {
    event.stopPropagation();
    if (file) {
      this.subs.sink = this.openDialog(SummaryComponent, {
        file,
        type: 'download',
        projectId: this.projectId,
      }).subscribe(async res => {
        if (!res) { return; }
        this.showIonModal(QueuedialogComponent, {
          projectId: this.projectId,
          jobType: 'download'
        });
      });
    } else {
      this.subs.sink = this.openDialog(SummaryComponent, {
        list: this.checkedList,
        type: 'download',
        projectId: this.projectId,
      }).subscribe(res => {
        if (!res) { return; }
        this.showIonModal(QueuedialogComponent, {
          projectId: this.projectId,
          jobType: 'download'
        });
        this.collectionService.clearCheckedList();
        this.updateColumnStatus();
      });
    }
  }
  editFolder(event, folder) {
    event.stopPropagation();
    this.subs.sink = this.openDialog(FolderComponent, {
      action: 'Edit',
      category: this.currentTab,
      projectId: this.projectId,
      folder,
    }).subscribe(res => {
      if (!res) {return;}
      this.projectService.collections.next(res.collections);
      this.projectService.changeCollection(this.breadcrumb, res.newUuid);
    });
  }
  editFiles(event, type, file?) {
    event.stopPropagation();
    const listObj = { music: [], video: [], merch: [], other: [] };
    if (file) {
      listObj[file.file_category].push(file);
    }
    const temp = type == 'single' ? listObj : this.checkedList;
    const data = _.cloneDeep(temp);
    this.subs.sink = this.openDialog(DetailComponent, {
      action: 'Edit',
      category: this.currentTab,
      projectId: this.projectId,
      type,
      data,
    }).subscribe(res => {
      if (!res) { return; }
      this.projectService.collections.next(res.collections);
      this.projectService.changeCollection(this.breadcrumb, res.newUuid);
    });
  }
  deleteFiles(event, type, file?) {
    event.stopPropagation();
    const temp = type == 'single' ? [file] :
      [...this.checkedList.music, ...this.checkedList.video, ...this.checkedList.merch, ...this.checkedList.other];
    const data = _.cloneDeep(temp);
    this.subs.sink = this.openDialog(ConfirmComponent, {
      action: 'Delete',
      itemType: 'File',
      category: this.currentTab,
      files: data,
      projectId: this.projectId,
    }).subscribe(res => {
      if (!res) { return; }
      console.log(res.collections);
      this.projectService.collections.next(res.collections);
      this.projectService.changeCollection(this.breadcrumb, res.newUuid);
      this.collectionService.clearCheckedList();
      this.updateColumnStatus();
    });
  }
  deleteFolder(event, folder) {
    event.stopPropagation();
    this.subs.sink = this.openDialog(ConfirmComponent, {
      action: 'Delete',
      itemType: 'Folder',
      category: this.currentTab,
      projectId: this.projectId,
      folder,
      files: [],
    }).subscribe(res => {
      if (!res) {return;}
      this.projectService.collections.next(res.collections);
      this.projectService.changeCollection(this.breadcrumb, res.newUuid);
    });
  }
  revertFile(event, file) {
    event.stopPropagation();
    this.openDialog(ConfirmComponent, {
      action: 'Revert',
      itemType: 'File',
      category: this.currentTab,
      projectId: this.projectId,
      files: [file]
    }).subscribe(res => {
      if (!res) { return; }
      this.projectService.collections.next(res.collections);
    });
  }
  revertFolder(event, folder) {
    event.stopPropagation();
    this.openDialog(ConfirmComponent, {
      action: 'Revert',
      itemType: 'Folder',
      category: this.currentTab,
      projectId: this.projectId,
      folder,
    }).subscribe(res => {
      if (!res) {return;}
      this.projectService.collections.next(res.collections);
    });
  }
  restoreFile(event, file) {
    event.stopPropagation();
    this.openDialog(ConfirmComponent, {
      action: 'Restore',
      itemType: 'File',
      category: this.currentTab,
      projectId: this.projectId,
      files: [file]
    }).subscribe(res => {
      if (!res) { return; }
      this.projectService.collections.next(res.collections);
    });
  }
  restoreFolder(event, folder) {
    event.stopPropagation();
    this.openDialog(ConfirmComponent, {
      action: 'Restore',
      itemType: 'Folder',
      category: this.currentTab,
      projectId: this.projectId,
      folder,
    }).subscribe(res => {
      if (!res) { return; }
      this.projectService.collections.next(res.collections);
    });
  }
  organizeMusic() {
    const data = _.cloneDeep(this.tracks);
    console.log({data});
    this.subs.sink = this.openDialog(OrganizeComponent, {
      projectId: this.projectId,
      tracks: data
    }).subscribe(res => {
      if (!res) { return; }
      this.projectService.collections.next(res.collections);
      this.projectService.changeCollection(this.breadcrumb, res.newUuid);
    });
  }
  addFolder() {
    this.subs.sink = this.openDialog(FolderComponent, {
      action: 'Add',
      category: this.currentTab,
      projectId: this.projectId,
    }).subscribe(res => {
      if (!res) { return; }
      this.projectService.collections.next(res.collections);
      this.projectService.changeCollection(this.breadcrumb, res.newUuid);
    });
  }
  uploadFile() { // step 1
    this.resetData();
    this.subs.sink = this.dialogService.open(UploadComponent, {
      closeOnBackdropClick: false,
      closeOnEsc: false,
    }).onClose.subscribe(res => {
      if (!res) {
        this.resetData();
        return;
      }
      this.isZip = res.isZip;
      this.uploadService.uploadCollectionFile(this.projectId, res.comment, res.uploadFile,
      this.collectionService.currentPath, this.currentTab);

      this.uploadFiles.music = res.files.music;
      this.uploadFiles.video = res.files.video;
      this.uploadFiles.merch = res.files.merch;
      this.uploadFiles.other = res.files.other;
      const comment = res.comment;
      this.setSteps();
      this.nextStep(comment, 1);
    });
  }
  nextStep(comment, stepIndex) {
    if (this.steps[0]) {
      setTimeout(() => {
        this.subs.sink = this.openDialog(DetailComponent, {
          action: 'Add',
          category: this.steps[0],
          data: this.uploadFiles,
          discards: this.discards,
          projectId: this.projectId,
          stepIndex,
          comment,
        }).subscribe(res => {
          if (!res) {
            this.uploadService.cancelUpload();
            this.resetData();
            return;
          }
          this.steps.shift();
          this.nextStep(res.comment, stepIndex + 1);
        });
      }, 0);
    } else {
      const changes = [...this.uploadFiles.music, ...this.uploadFiles.video, ...this.uploadFiles.merch, ...this.uploadFiles.other];
      if (changes.length) {
        this.subs.sink = this.openDialog(SummaryComponent, {
          list: this.uploadFiles,
          discards: this.discards,
          type: 'summary',
          projectId: this.projectId,
          comment,
          isZip: this.isZip
        }).subscribe(async res => {
          if (!res) {
            this.uploadService.cancelUpload();
            this.resetData();
            return;
          }
          if (!this.isZip) {
            console.log('single file', res);
            this.subs.sink = this.projectService.getCollections(this.projectId).subscribe(collections => {
              this.projectService.collections.next(collections);
              this.projectService.changeCollection(this.breadcrumb, collections[0].collection_uuid);
            });
            return;
          }
          const modal =  await this.modalController.create({
            component: QueuedialogComponent,
            componentProps: {
              projectId: this.projectId,
              jobType: 'upload'
            },
          });
          modal.onDidDismiss().then(result => {
            if (result.data) {
              const collections = result.data.collections;
              this.projectService.collections.next(collections);
              this.projectService.changeCollection(this.breadcrumb, collections[0].collection_uuid);
            }
          });
          return await modal.present();
        });
      }
      this.resetData();
    }
  }

  showBlockchainView(event) {
    event.stopPropagation();
    const modal = this.showIonModal(BlockchainComponent);
  }
  expandColumn(index) {
    this.expandStatus[index] = !this.expandStatus[index];
  }
  setSteps() {
    this.steps = [];
    if (this.uploadFiles.video.length > 0) { this.steps.push('Video'); }
    if (this.uploadFiles.merch.length > 0) { this.steps.push('Merch'); }
    if (this.uploadFiles.other.length > 0) { this.steps.push('Other'); }
    const index = this.steps.findIndex(x => x == this.currentTab);
    if (index != -1) {
      [this.steps[0], this.steps[index]] = [this.steps[index], this.steps[0]];
    }
    if (this.uploadFiles.music.length > 0) { this.steps.unshift('Music'); }
  }
  resetData() {
    this.changes = {
      music: [],
      video: [],
      merch: [],
      other: [],
    };
    this.discards = {
      music: [],
      video: [],
      merch: [],
      other: [],
    };
    this.steps = [];
    this.uploadFiles = [];
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
  async showIonModal(component, context = {}) {
    const modal = await this.modalController.create({
      component,
      componentProps: context
    });
    return await modal.present();
  }
  onClickBreadcrumb(index) {
    this.breadcrumbService.sliceBreadcrumb(index + 1);
    let param = '';
    this.breadcrumb.forEach(element => {
      param += `/${element.name}`;
    });
    this.collectionService.updateDataWithBreadcrumb(this.breadcrumb, this.collectionUuid);
  }

  onCheckAll() {
    this.checkArray.fill(this.checkAll);
  }
  get isLatestCollection() {
    return this.projectService.isLatestCollection;
  }
  getFileName(str: string) {
    const index = str.indexOf('.');
    return str.slice(0, index);
  }
  getFileKind(str: string) {
    const index = str.indexOf('.');
    return str.slice(index + 1, str.length);
  }
  clickCheckbox(file, index) {
    if (this.checkArray[index]) {
      this.collectionService.addToCheckedList(file);
    } else {
      this.collectionService.deleteFromCheckedList(file);
    }
  }
  get checkedItemsCount() {
    return this.checkedList.music.length + this.checkedList.video.length + this.checkedList.merch.length + this.checkedList.other.length;
  }
  showCheckedList() {
    console.log(this.checkedList);
    this.subs.sink = this.dialogService.open(SummaryComponent, {
      closeOnBackdropClick: false,
      closeOnEsc: false,
      context: {
        list: this.checkedList,
        type: 'view',
        projectId: this.projectId,
      }
    }).onClose.subscribe(res => {
      this.updateColumnStatus();
    });
  }
  navigateFolder(folder) {
    this.breadcrumbService.addBreadcrumbItem({ name: folder.directory_name });
    let param = '';
    this.breadcrumb.forEach(element => {
      param += `${element.name}/`;
    });
    this.router.navigate([], { queryParams: { version: this.sharedService.getQueryParameter('version'), path: param } });
  }
  onClickInfo(event) {
    event.preventDefault();
    event.stopPropagation();
  }
  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
