import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-filehistory',
  templateUrl: './filehistory.component.html',
  styleUrls: ['./filehistory.component.scss'],
})
export class FilehistoryComponent implements OnInit {
  @Input() history: any;

  constructor(
    private modalController: ModalController
  ) { }

  ngOnInit() {}

  close() {
    this.modalController.dismiss();
  }
}
