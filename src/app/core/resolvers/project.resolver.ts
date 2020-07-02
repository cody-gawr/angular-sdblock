import { Injectable } from '@angular/core';
import { Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { ProjectService } from 'src/app/services/project/project';
import { TeamMember } from 'src/app/models/team';

@Injectable({
  providedIn: 'root'
})
export class ProjectResolver implements Resolve<any> {
  constructor(
    private projectService: ProjectService
  ) {}

  resolve( route: ActivatedRouteSnapshot, state: RouterStateSnapshot ): Observable<any> {
    const projectId = route.paramMap.get('id');
    return this.projectService.getProjectByID(projectId);
  }
}
