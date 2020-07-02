import { Component, OnInit, ViewChild, Input, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { IonTextarea } from '@ionic/angular';
import { NbDialogRef } from '@nebular/theme';
import { Observable } from 'rxjs';
import { SubSink } from 'subsink';

import { CollectionService } from 'src/app/services/project/collection';
import { BreadcrumbService } from 'src/app/services/project/breadcrumb';
import { ProjectService } from 'src/app/services/project/project';
import { FileTransferService } from 'src/app/services/project/filetransfer';
import * as _ from 'lodash';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
})
export class DetailComponent implements OnInit, OnDestroy {
  @ViewChild('commentInput', { static: false }) commentInput: IonTextarea;
  @Input() action: any;
  @Input() category: string;
  @Input() type: any;
  @Input() data: any;

  @Input() stepIndex: any;
  @Input() comment: any;
  @Input() changes: any[];
  @Input() discards: any[];
  @Input() projectId: string;

  private subs = new SubSink();
  
  files: any;
  tracks: any[];
  currentTab: any;

  constructor(
    protected dialogRef: NbDialogRef<any>,
    private activatedRoute: ActivatedRoute,
    private projectService: ProjectService,
    public transferService: FileTransferService,
    private collectionService: CollectionService,
    private breadcrumbService: BreadcrumbService,
  ) { }

  ngOnInit() {
    this.getData();
  }

  getData() {
    this.subs.sink = this.projectService.watchProjectTracks().subscribe(res => {
      this.tracks = _.cloneDeep(res);
    });
    this.subs.sink = this.collectionService.watchCurrentTab().subscribe(res => {
      this.currentTab = res;
    });
    
    for (const item of this.data.video) {
      item.trackName = item.track ? item.track.file_title : '';
    }
    this.files = this.data[this.category.toLowerCase()];
    this.tracks = [...this.tracks, ...this.data.music];
  }
  
  getDialogTitle() {
    let title = '';
    if (this.action == 'Add') {
      title = `Step ${this.stepIndex}: Add ${this.category} Files`;
    } else if (this.action == 'Edit') {
      if (this.type == 'single') {
        title = `Edit ${this.category} File`;
      } else {
        title = 'Edit Files';
      }
    }
    return title;
  }
  
  doReorder(ev: any) {
    this.files = ev.detail.complete(this.files);
  }
  deleteAttachment(file) {
    this.discards[file.file_category].push(file);
    this.files = this.files.filter(x => x.file_uuid != file.file_uuid);
  }
  onTitleChange( file ) {
    const kind = this.getFileKind(file.file_name);
    file.file_name =  `${file.file_title.replace(/ /, '-')}.${kind}`;
  }
  onNameChange(event, file) {
    file.file_name = event.target.data + this.getFileKind(file.file_name);
  }
  onClickVideoTrack(file, track) {
    file.track = track;
  }
  getFileName(str: string) {
    const index = str.indexOf('.');
    return str.slice(0, index);
  }
  getFileKind(str: string) {
    const index = str.indexOf('.');
    return str.slice(index + 1, str.length);
  }
  capitalize(str: string) {
    return str[0].toUpperCase() + str.slice(1);
  }
  close() {
    this.dialogRef.close();
  }
  save() {
    if (!this.comment) {
      this.commentInput.setFocus();
      return;
    }
    this.subs.sink =  this.collectionService.editFiles(this.currentTab, this.projectId, this.comment, this.files).subscribe(result => {
      this.subs.sink = this.projectService.getCollections(this.projectId).subscribe(col => {
        this.dialogRef.close({
          collections: col,
          newUuid: result.collection_uuid
        });
      });
    });
  }
  saveNext() {
    if (!this.comment) {
      this.commentInput.setFocus();
      return;
    }
    this.data[this.category.toLowerCase()] = this.files;
    this.dialogRef.close({
      action: 'save',
      comment: this.comment,
      files: this.files,
    });
  }
  discard() {
    for (const file of this.files) {
      this.discards[file.file_category].push(file);
    }
    this.data[this.category.toLowerCase()] = [];
    this.dialogRef.close({
      action: 'discard',
      comment: this.comment,
      files: [],
    });
  }
  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
