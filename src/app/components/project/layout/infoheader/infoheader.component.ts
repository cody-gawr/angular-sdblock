import { Component, OnInit } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService } from 'src/app/services/project/project';
import { CollectionService } from 'src/app/services/project/collection';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-infoheader',
  templateUrl: './infoheader.component.html',
  styleUrls: ['./infoheader.component.scss'],
})
export class InfoheaderComponent implements OnInit {
  private subs = new SubSink();
  projectID: number;
  project: any;
  artwork = 'assets/images/bj.png';

  constructor(
    public projectService: ProjectService,
    private dialogService: NbDialogService,
    private activatedRoute: ActivatedRoute,
    private collectionService: CollectionService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.getProject();
  }

  getProject() {
    this.subs.sink = this.projectService.watchProjectInfo().subscribe(project => {
      this.project = project;
      // this.artwork = this.project.image;
    });
    this.subs.sink = this.activatedRoute.params.subscribe(params => {
      this.projectID = parseInt(params.id, 10);
    });
  }

  updateArtwork(event) {
    console.log(this.artwork);
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = e => {
        const path = reader.result;
        this.artwork = typeof path === 'string' ? path : path.toString();
        console.log(this.artwork);
      };
      reader.readAsDataURL(file);
    }
  }
  openDialog(dialog) {
    this.dialogService.open(dialog, {
      closeOnBackdropClick: false,
      closeOnEsc: false
    });
  }
  closeDialog(ref) {
    ref.close();
  }
}
