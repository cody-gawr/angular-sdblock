import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CollectionService } from 'src/app/services/project/collection';

@Component({
  selector: 'upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.scss']
})
export class UploadFileComponent {
  @Input() placeholder: string;
  @Output() fileSelected = new EventEmitter<File>();

  progress: any;
  files: any = [];
  hasFile: boolean;

  constructor(
    public documentsService: CollectionService,
  ) { }

  uploadFile(event) {
    const file = event[0];
    this.fileSelected.emit(file);
  }
}
