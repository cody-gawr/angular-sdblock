import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  Route
} from '@angular/router';
import { Observable } from 'rxjs';
import { ProjectService } from 'src/app/services/project/project';
import { Location } from '@angular/common';

@Injectable()
export class ProjectGuard implements CanActivate {
  constructor(
    private projectService: ProjectService,
    private location: Location,
    private router: Router
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.projectService.projectValid;
  }
}
