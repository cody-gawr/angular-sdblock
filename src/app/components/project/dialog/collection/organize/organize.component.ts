import { Component, OnInit, Input, ViewChild, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { IonTextarea } from '@ionic/angular';
import { NbDialogRef } from '@nebular/theme';
import { SubSink } from 'subsink';

import { ProjectService } from 'src/app/services/project/project';
import { CollectionService } from 'src/app/services/project/collection';
import * as _ from 'lodash';

@Component({
  selector: 'app-organize',
  templateUrl: './organize.component.html',
  styleUrls: ['./organize.component.scss'],
})
export class OrganizeComponent implements OnInit, OnDestroy {
  @ViewChild('commentInput', { static: false }) commentInput: IonTextarea;
  @Input() tracks: any;
  @Input() projectId: string;
  private subs = new SubSink();

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
    for (let i = 0; i < this.tracks.length; i ++) {
      this.tracks[i].file_track = i + 1;
    }
  }

  doReorder(ev: any) {
    this.tracks = ev.detail.complete(this.tracks);
  }

  submit() {
    if (!this.comment) {
      this.commentInput.setFocus();
      return;
    }
    for (let i = 0; i < this.tracks.length; i ++) {
      this.tracks[i].file_track = i + 1;
    }
    this.subs.sink = this.collectionService.organizeMusic('Music', this.projectId, this.comment, this.tracks).subscribe(result => {
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
