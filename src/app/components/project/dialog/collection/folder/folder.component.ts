import { Component, OnInit, Input, ViewChild, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { IonTextarea } from '@ionic/angular';
import { NbDialogRef } from '@nebular/theme';
import { SubSink } from 'subsink';
import { ProjectService } from 'src/app/services/project/project';
import { CollectionService } from 'src/app/services/project/collection';

import * as _ from 'lodash';
@Component({
  selector: 'app-folder',
  templateUrl: './folder.component.html',
  styleUrls: ['./folder.component.scss'],
})
export class FolderComponent implements OnInit, OnDestroy {
  @ViewChild('commentInput', { static: false }) commentInput: IonTextarea;
  @Input() action: any;
  @Input() category: any;
  @Input() folder?: any;
  @Input() projectId: string;
  private subs = new SubSink();

  folderName: any;
  comment: any;
  currentTab: any;

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
    if (this.folder) {
      this.folderName = this.folder.directory_name;
    }
  }

  submit() {
    if (!this.folderName) {
      document.getElementById('folderNameInput').focus();
      return;
    }
    if (!this.comment) {
      this.commentInput.setFocus();
      return;
    }
    const path = this.collectionService.currentPath;
    this.subs.sink = this.collectionService.addFolder(this.currentTab, this.projectId, this.comment, this.folderName, path)
    .subscribe(result => {
      this.subs.sink = this.projectService.getCollections(result.project_uuid).subscribe(col => {
        this.dialogRef.close({
          collections: col,
          newUuid: result.collection_uuid
        });
      });
    });
  }

  edit() {
    if (!this.folderName) {
      document.getElementById('folderNameInput').focus();
      return;
    }
    if (!this.comment) {
      this.commentInput.setFocus();
      return;
    }
    const path = this.collectionService.currentPath;
    this.subs.sink = this.collectionService.editFolder(this.currentTab, this.projectId, this.comment, 
      this.folder.directory_name, this.folderName, path).subscribe(result => {
        console.log({result});
        this.subs.sink = this.projectService.getCollections(result.project_uuid).subscribe(col => {
          this.dialogRef.close({
            collections: col,
            newUuid: result.collection_uuid
          });
        });
    });
  }

  close() {
    this.dialogRef.close();
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
