import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpEventType, HttpErrorResponse, HttpEvent } from '@angular/common/http';
import { BehaviorSubject, Observable, of, Subscription, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FileTransferService {

  uploadSub: Subscription;
  progress: number;
  inProgress: boolean;
  uploadFailed: boolean;
  fileName: any;

  job: any;
  reqTemp: any;

  constructor(
    private http: HttpClient,
  ) {
    this.initUploadStatus();
  }

  initUploadStatus() {
    this.progress = 0;
    this.uploadFailed = false;
  }

  uploadCollectionFile(project, comment, file, path, tab) {
    this.reqTemp = {project, comment, file, path, tab};
    const formData = new FormData();
    formData.append('project', project);
    formData.append('file', file);
    formData.append('collection_comment', comment);
    formData.append('file_path', path);
    formData.append('file_category', tab);

    this.initUploadStatus();
    this.uploadSub = this.http.post<any>(`soundblock/project/collection/file`, formData, {
      reportProgress: true,
      observe: 'events'
    }).pipe(map((event: HttpEvent<any>) => {
      switch (event.type) {
        case HttpEventType.UploadProgress:
          this.progress = Math.round(event.loaded * 100 / event.total);
          break;
        case HttpEventType.Response:
          return event.body;
      }
    }), catchError((error: HttpErrorResponse) => {
      this.uploadFailed = true;
      console.log({error});
      this.cancelUpload();
      return throwError(error);
    })).subscribe(response => {
      if (response) {
        this.fileName = response.data;
        console.log({response});
      }
    }, err => {
      console.log({err});
    });
  }

  uploadCollectionFileConfirm(project, files, comment, isZip, fileName) {
    const req = {project, collection_comment: comment, files, is_zip: isZip, file_name: fileName};
    return this.http.post<any>(`soundblock/project/collection/confirm`, req).pipe(map(res => {
      return res.data;
    }));
  }

  uploadAgain() {
    this.uploadSub.unsubscribe();
    this.uploadCollectionFile(this.reqTemp.project, this.reqTemp.comment, this.reqTemp.file, this.reqTemp.path, this.reqTemp.tab);
  }

  cancelUpload() {
    this.uploadSub.unsubscribe();
  }

  downloadFileFromUrl(url) {
    return this.http.get(url, {responseType: 'arraybuffer'});
  }

  getJobStatus(jobUuid) {
    return this.http.get<any>(`job/status?job=${jobUuid}`).pipe(map(res => {
      return res.data;
    }));
  }

  setJobSilentAlert(jobUuid, isSilent) {
    const req = {
      job: jobUuid,
      flag_silentalert: isSilent ? 1 : 0,
    };
    return this.http.patch<any>(`job`, req);
  }
}
