import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { SubSink } from 'subsink';

import { CollectionService } from 'src/app/services/project/collection';
import { SharedService } from 'src/app/services/shared/shared';

@Component({
  selector: 'app-historydialog',
  templateUrl: './historydialog.component.html',
  styleUrls: ['./historydialog.component.scss'],
})
export class HistorydialogComponent implements OnInit {
  private subs = new SubSink();

  versionInfo: any;
  curVersion: any;
  versionIndex: any;
  versionDate: any;
  expandFlag = [];
  constructor(
    private router: Router,
    private modalController: ModalController,
    private sharedService: SharedService,
    private documentsService: CollectionService,
  ) { }

  ngOnInit() {
    this.getCollectionHistory();
  }

  getCollectionHistory() {
  }

  selectVersion() {
    this.close();
    const urlSegs = this.router.url.split('?');
    const path = urlSegs[0];
    this.router.navigate([path], { queryParams: { version: this.versionInfo[this.versionIndex].data.id,
      path: this.sharedService.getQueryParameter('path') }});
  }

  onAction(e, index) {
    e.stopPropagation();
    // this.showChangeDetail(index);
    this.expandFlag[index] = !this.expandFlag[index];
  }

  onSelectOption(index) {
    this.versionIndex = index;
    this.curVersion = this.versionInfo[index].data;
  }

  close() {
    this.modalController.dismiss();
  }
}
