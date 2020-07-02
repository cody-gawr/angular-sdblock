import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NbDialogRef } from '@nebular/theme';
import { SubSink } from 'subsink';
import { ProjectService } from 'src/app/services/project/project';
import { CollectionService } from 'src/app/services/project/collection';
import { FileTransferService } from 'src/app/services/project/filetransfer';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss'],
})
export class SummaryComponent implements OnInit, OnDestroy {
  @Input() list: any;
  @Input() file?: any;
  @Input() discards?: any;
  @Input() type?: any;
  @Input() comment?: string;
  @Input() projectId: string;
  @Input() isZip?: any;
  private subs = new SubSink();

  collectionUuid: string;
  title = 'Selected Files';
  sections = ['music', 'video', 'merch', 'other'];
  constructor(
    protected dialogRef: NbDialogRef<any>,
    private activatedRoute: ActivatedRoute,
    private projectService: ProjectService,
    private collectionService: CollectionService,
    public transferService: FileTransferService,
  ) { }

  ngOnInit() {
    console.log(this.list);
    this.subs.sink = this.projectService.watchCollectionUuid().subscribe(res => {
      this.collectionUuid = res;
    });
    if (this.file) {
      this.list = { music: [], video: [], merch: [], other: [] };
      this.list[this.file.file_category].push(this.file);
    }
    if (this.type == 'view') {
      this.title = 'Selected Files';
    }
    if (this.type == 'summary') {
      this.title = 'Summary';
    }
    if (this.type == 'download') {
      this.title = 'Download Files';
    }
  }

  close() {
    this.dialogRef.close();
  }

  submit() {
    console.log(this.list);
    const files = [...this.list.music, ...this.list.video, ...this.list.merch, ...this.list.other];
    this.subs.sink = this.transferService.uploadCollectionFileConfirm(this.projectId, files, this.comment, this.isZip, this.transferService.fileName).subscribe(result => {
      console.log({jobInfo: result});
      if (this.isZip) {
        this.transferService.job = result;
        this.dialogRef.close({
          action: 'submit',
        });
      } else {
        this.subs.sink = this.projectService.getCollections(this.projectId).subscribe(col => {
          this.dialogRef.close({
            collections: col,
            newUuid: result.collection_uuid
          });
        });
      }
    });
  }

  download() {
    const files = [...this.list.music, ...this.list.video, ...this.list.merch, ...this.list.other];
    this.subs.sink = this.collectionService.downloadFiles(this.collectionUuid, files).subscribe(jobInfo => {
      console.log({jobInfo});
      this.transferService.job = jobInfo;
      this.dialogRef.close({
        action: 'download'
      });
    });
  }
  clear() {
    this.list = {
      music: [],
      video: [],
      merch: [],
      other: []
    };
    this.collectionService.clearCheckedList();
    this.dialogRef.close();
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
