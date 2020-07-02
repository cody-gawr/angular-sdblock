import { Injectable } from '@angular/core';
import { Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { ProjectService } from 'src/app/services/project/project';

@Injectable({
  providedIn: 'root'
})
export class InviteResolver implements Resolve<any> {
  constructor(
    private projectService: ProjectService
  ) {}

  resolve( route: ActivatedRouteSnapshot, state: RouterStateSnapshot ): Observable<any> {
    const inviteHash = route.paramMap.get('hash');
    return this.projectService.getInviteDetail(inviteHash);
  }
}
