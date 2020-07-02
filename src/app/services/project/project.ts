import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

import { CollectionService } from './collection';
import { Project } from 'src/app/models/project';
import { Draft } from 'src/app/models/draft';
import { TeamMember, Team, Contract } from 'src/app/models/team';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  project: BehaviorSubject<Project>;
  collections: BehaviorSubject<any[]>;
  collectionUuid: BehaviorSubject<string>;
  tracks: BehaviorSubject<any>;

  projectDraft: BehaviorSubject<Draft>;
  projectValid =  false;

  path: any;

  constructor(
    private router: Router,
    private http: HttpClient,
    private collectionService: CollectionService,
  ) {
    this.initData();
  }

  initData() {
    this.project = new BehaviorSubject(new Project());
    this.projectDraft = new BehaviorSubject(new Draft());
    this.collections = new BehaviorSubject([]);
    this.collectionUuid = new BehaviorSubject('');
    this.tracks = new BehaviorSubject([]);
  }

  getPath() {
    const arr = this.router.url.split('?');
    return arr[0];
  }

  // Get Project Info

  getProjects(): Observable<Project[]> {
    return this.http.get<any>(`soundblock/projects`).pipe(map(res => {
      console.log(res);
      return res.data.map(project => {
        return new Project().deserialize(project);
      });
    }));
  }

  getProjectByID(uuid): Observable<Project> {
    return this.http.get<any>(`soundblock/project/${uuid}`).pipe(map(res => {
      const data = res.data;
      return new Project().deserialize(data);
    }));
  }

  getProjectService(uuid) {
    return this.http.get<any>(`soundblock/service?project=${uuid}`).pipe(map(res => {
      return res.data;
    }));
  }

  getCollections(projectID) {
    return this.http.get<any>(`soundblock/project/collections?project=${projectID}`).pipe(map(res => {
      return res.data;
    }));
  }

  getPlatforms() {
    return this.http.get<any>(`soundblock/platforms`).pipe(map(res => {
      return res.data;
    }));
  }

  // Create Project

  createProject(project) {
    return this.http.post<any>(`soundblock/project`, project).pipe(map(res => {
      return res.data;
    }));
  }

  uploadArtwork(project, file) {
    const formData = new FormData();
    formData.append('project', project);
    formData.append('project_avatar', file);
    return this.http.post<any>(`soundblock/project/upload-artwork`, formData).pipe(map(res => {
      return res.data;
    }));
  }

  // Contract & Team

  getProjectTeam(uuid) {
    return this.http.get<any>(`soundblock/project/${uuid}/team`).pipe(map(res => {
      res.data.team = new Team().deserialize(res.data.team);
      return res.data;
    }));
  }

  getUserProjectPermission(team, user) {
    return this.http.get<any>(`soundblock/project/${team}/user/${user}/permissions`).pipe(map(res => {
      return res.data;
    }));
  }

  getProjectContract(project) {
    return this.http.get<any>(`soundblock/project/${project}/contract`).pipe(map(res => {
      return new Contract().deserialize(res.data);
    }));
  }

  updateProjectContract(project, members) {
    const req = { members };
    return this.http.post<any>(`soundblock/project/${project}/contract`, req).pipe(map(res => {
      return new Contract().deserialize(res.data);
    }));
  }

  acceptProjectContract(contract) {
    const req = { };
    return this.http.patch<any>(`soundblock/project/contract/${contract}/accept`, req).pipe(map(res => {
      return res.data;
    }));
  }

  rejectProjectContract(contract) {
    const req = { };
    return this.http.patch<any>(`soundblock/project/contract/${contract}/reject`, req).pipe(map(res => {
      return res.data;
    }));
  }

  addTeamMember(team, member: TeamMember, permissions) {
    const req = { team, name: member.name, user_auth_email: member.user_auth_email, user_role: member.user_role, permissions };
    return this.http.post<any>(`soundblock/project/team`, req).pipe(map(res => {
      return res.data;
    }));
  }

  getTeamMemberPermission(team, user) {
    return this.http.get<any>(`soundblock/project/team/${team}/user/${user}/permissions`).pipe(map(res => {
      return res.data.permissions_in_team;
    }));
  }

  setTeamMemberPermission(team, user, permissions) {
    const req = {team, user, permissions};
    console.log({permissions});
    return this.http.patch<any>(`soundblock/project/team/permissions`, req).pipe(map(res => {
      return res.permissions_in_group;
    }));
  }

  // Deployment

  getDeploy(uuid) {
    return this.http.get<any>(`soundblock/project/${uuid}/deployments?per_page=100`).pipe(map(res => {
      return res.data;
    }));
  }

  deployProject(project, platform) {
    const req = { project, platform};
    return this.http.post<any>(`soundblock/project/deploy`, req).pipe(map(res => {
      return res.data;
    }));
  }

  // Drafts

  getDrafts() {
    return this.http.get<any>(`soundblock/drafts`).pipe(map(res => {
      return res.data;
    }));
  }

  saveDraft(draft) {
    return this.http.post<any>(`soundblock/draft`, draft).pipe(map(res => {
      return res;
    }));
  }

  uploadDraftArtwork(file, service, draft) {
    const formData = new FormData();
    formData.append('service', service);
    if (draft) {
      formData.append('draft', draft);
    }
    formData.append('project_artwork', file);
    return this.http.post<any>(`soundblock/draft/artwork`, formData).pipe(map(res => {
      console.log({res});
      return res.data;
    }));
  }
  // Invite

  getInviteDetail(hash) {
    return this.http.get<any>(`soundblock/invite/${hash}`).pipe(map(res => {
      return res.data;
    }));
  }

  watchProjectInfo(): Observable<Project> {
    return this.project.asObservable();
  }
  watchProjectCollections() {
    return this.collections.asObservable();
  }
  watchCollectionUuid() {
    return this.collectionUuid.asObservable();
  }
  watchProjectTracks() {
    return this.tracks.asObservable();
  }
  watchProjectDraft() {
    return this.projectDraft.asObservable();
  }

  setProjectInfo(project: Project) {
    this.project.next(project);
    if (project.collections) {
      const uuid = project.collections[0].collection_uuid;
      this.collectionUuid.next(uuid);
      this.collections.next(project.collections);
      this.tracks.next(project.tracks);
    } else {
      this.collectionUuid.next('');
      this.collections.next([]);
      this.tracks.next([]);
    }
  }

  changeCollection(breadcrumb, uuid) {
    this.collectionUuid.next(uuid);
    this.router.navigate([this.getPath()], { queryParams: { version: uuid, path: this.collectionService.currentPath }});
  }

  get isLatestCollection() {
    if (this.collections.value[0].collection_uuid == this.collectionUuid.value) {
      return true;
    }
    return false;
  }
}
