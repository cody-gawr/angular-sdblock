import { Component, OnInit, TemplateRef, ViewChild, OnDestroy } from '@angular/core';
import { SubSink } from 'subsink';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { TeamMember } from 'src/app/models/team';
import { ProjectService } from 'src/app/services/project/project';

@Component({
  selector: 'app-people',
  templateUrl: './team.page.html',
  styleUrls: ['./team.page.scss'],
})
export class TeamPage implements OnInit, OnDestroy {
  private subs = new SubSink();
  teamObs: Observable<any>;
  projectId: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private projectService: ProjectService
  ) { }

  ngOnInit() {
    this.subs.sink = this.activatedRoute.params.subscribe(routeParams => {
      this.projectId = routeParams.id;
      this.teamObs = this.projectService.getProjectTeam(this.projectId);
    });
  }

  navigate(url) {
    this.router.navigate([`/project/${this.projectId}/${url}`]);
  }

  refresh() {
    this.teamObs = this.projectService.getProjectTeam(this.projectId);
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
