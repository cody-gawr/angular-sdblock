import { Component, OnInit } from '@angular/core';
import { NbDialogService } from '@nebular/theme';

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit {

  videoUrl = 1;

  slideOpts = {
    initialSlide: 0,
    speed: 400,
  };
  
  constructor(
    private dialogService: NbDialogService,
  ) { }

  ngOnInit() {
  }

  playVideo(url, ref) {
    this.videoUrl = url;
    this.dialogService.open(ref, {
      closeOnBackdropClick: true,
      closeOnEsc: true
    });
  }
}
