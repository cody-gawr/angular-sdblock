import { Component, OnInit, Input, ViewChild, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { IonTextarea } from '@ionic/angular';
import { NbDialogRef } from '@nebular/theme';
import { SubSink } from 'subsink';

import { ProjectService } from 'src/app/services/project/project';
import { CollectionService } from 'src/app/services/project/collection';
import * as _ from 'lodash';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.scss'],
})

export class ConfirmComponent implements OnInit, OnDestroy{
  @ViewChild('commentInput', { static: false }) commentInput: IonTextarea;

  private subs = new SubSink();
  @Input() action: any;
  @Input() category: any;
  @Input() itemType: any;
  @Input() files?: any;
  @Input() folder?: any;
  @Input() projectId: string;

  currentTab: any;
  collectionUuid: any;
  comment: any;

  constructor(
    protected dialogRef: NbDialogRef<any>,
    private activatedRoute: ActivatedRoute,
    private projectService: ProjectService,
    private collectionService: CollectionService,
  ) { }

  ngOnInit() {
    this.subs.sink = this.collectionService.watchCurrentTab().subscribe(res => {
      this.currentTab = res;
    });
    this.subs.sink = this.projectService.watchCollectionUuid().subscribe(res => {
      this.collectionUuid = res;
    });
  }

  delete() {
    if (!this.comment) {
      this.commentInput.setFocus();
      return;
    }
    if (this.itemType == 'File') {
      this.subs.sink = this.collectionService.deleteFiles(this.currentTab, this.projectId, this.comment, this.files)
      .subscribe(result => {
        console.log({result});
        this.subs.sink = this.projectService.getCollections(this.projectId).subscribe(col => {
          this.dialogRef.close({
            collections: col,
            newUuid: result.collection_uuid
          });
        });
      });
    } else if (this.itemType == 'Folder') {
      this.subs.sink = this.collectionService.deleteFolder(this.currentTab, this.projectId, this.comment,
        this.folder.directory_name, this.folder.directory_path).subscribe(result => {
        this.subs.sink = this.projectService.getCollections(this.projectId).subscribe(col => {
          this.dialogRef.close({
            collections: col,
            newUuid: result.collection_uuid
          });
        });
      });
    }
  }
  revert() {
    if (!this.comment) {
      this.commentInput.setFocus();
      return;
    }
    if (this.itemType == 'File') {
      this.subs.sink = this.collectionService.revertFile(this.currentTab, this.collectionUuid, this.comment, this.files)
      .subscribe(result => {
        this.subs.sink = this.projectService.getCollections(result.project_uuid).subscribe(col => {
          this.dialogRef.close({
            collections: col,
            newUuid: result.collection_uuid
          });
        });
      });
    } else if (this.itemType == 'Folder') {
      this.subs.sink = this.collectionService.revertFolder(this.currentTab, this.collectionUuid, this.comment, this.folder.uuid)
      .subscribe(result => {
        this.subs.sink = this.projectService.getCollections(result.project_uuid).subscribe(col => {
          this.dialogRef.close({
            collections: col,
            newUuid: result.collection_uuid
          });
        });
      });
    }
  }
  restore() {
    if (!this.comment) {
      this.commentInput.setFocus();
      return;
    }
    if (this.itemType == 'File') {
      this.subs.sink = this.collectionService.restoreFile(this.currentTab, this.collectionUuid, this.comment, this.files)
      .subscribe(result => {
        this.subs.sink = this.projectService.getCollections(result.project_uuid).subscribe(col => {
          this.dialogRef.close({
            collections: col,
            newUuid: result.collection_uuid
          });
        });
      });
    } else if (this.itemType == 'Folder') {
      this.subs.sink = this.collectionService.restoreFolder(this.currentTab, this.collectionUuid, this.comment, this.folder.uuid)
      .subscribe(result => {
        this.subs.sink = this.projectService.getCollections(result.project_uuid).subscribe(col => {
          this.dialogRef.close({
            collections: col,
            newUuid: result.collection_uuid
          });
        });
      });
    }
  }

  getDialogTitle() {
    let title = '';
    title = `${this.action} ${this.category}`;
    if (this.action != 'Delete' || (this.files.length == 1 && this.files)) {
      title += this.itemType == 'Folder' ? ` Folder(${this.folder.directory_name})` : ` File(${this.files[0].file_name})`;
    }
    return title;
  }

  close() {
    this.dialogRef.close();
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }  
}
