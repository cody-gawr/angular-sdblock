import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
@Component({
  selector: 'app-alert-dialog',
  templateUrl: './alert-dialog.component.html',
  styleUrls: ['./alert-dialog.component.scss'],
})
export class AlertDialogComponent implements OnInit {
  @Input() title: string;
  @Input() message: string;
  @Input() description: string;

  constructor(
    private modalController: ModalController
  ) { }

  ngOnInit() {}

  onClose() {
    this.modalController.dismiss({});
  }

  onConfirm() {
    this.modalController.dismiss({
      data: true
    });
  }
}
