import { Component, OnInit, Input, TemplateRef, ViewChild, Output, EventEmitter, OnDestroy } from '@angular/core';
import { NbTreeGridDataSourceBuilder, NbDialogService } from '@nebular/theme';
import { SubSink } from 'subsink';
import { TeamMember, Team } from 'src/app/models/team';
import { ProjectService } from 'src/app/services/project/project';
import { SharedService } from 'src/app/services/shared/shared';
import { Permission } from 'src/app/models/permission';

@Component({
  selector: 'app-teamtable',
  templateUrl: './teamtable.html',
  styleUrls: ['./teamtable.scss'],
})
export class TeamtableComponent implements OnInit, OnDestroy {
  @ViewChild('memberDialog', { static: false }) memberDialog: TemplateRef<any>;
  @Input() projectId: any;
  @Input() data: any;
  @Output() changed = new EventEmitter<any>();

  private subs = new SubSink();

  teamPermission: Permission;
  team: Team;

  isNewMember = false;
  newMember: TeamMember;
  permission = new Permission();
  permissionTab = 0;
  selectedMemberUuid: string;
  emailRegEx = /[a-zA-Z0-9.-_]{1,}@[a-zA-Z.-_]{1,}[.]{1}[a-zA-Z]{2,}/;

  roles: any = ['Accountant', 'Administrator', 'Band Member', 'Booking Agent', 'Composer', 'Designer', 'Investor', 'Label',
    'Lawyer', 'Manager', 'Owner', 'Publisher', 'Writer', '(Other)'];
  subPermissions = ['Add', 'Restore', 'Download', 'Delete', 'Update'];
  sections = ['Music', 'Video', 'Merch', 'Other'];

  constructor(
    private dialogService: NbDialogService,
    private projectService: ProjectService,
    private sharedService: SharedService,
  ) { }

  ngOnInit() {
    this.teamPermission = this.sharedService.parsePermissionsArrayToObject(this.data.permissions_in_team);
    this.team = this.data.team;
  }
  
  showMemberDialog(ref) {
    this.isNewMember = true;
    this.newMember = new TeamMember();
    this.showDialog(ref);
  }
  setPermission(ref, dialog, form) {
    if (!form.valid) { return; }
    ref.close();
    console.log('new member', this.newMember);
    this.permission = new Permission();
    this.showDialog(dialog);
  }
  addMember(ref) {
    const permissionArray = this.sharedService.parsePermissionsObjectToArray(this.permission);
    this.subs.sink = this.projectService.addTeamMember(this.team.team_uuid, this.newMember, permissionArray).subscribe(res => {
      this.changed.emit();
      this.closeDialog(ref);
    });
  }
  editPermission(ref, member) {
    this.showDialog(ref);
    this.isNewMember = false;
    this.selectedMemberUuid = member.user_uuid;
    this.subs.sink = this.projectService.getTeamMemberPermission(this.team.team_uuid, member.user_uuid).subscribe(res => {
      this.permission = this.sharedService.parsePermissionsArrayToObject(res);
    });
  }
  savePermission(ref) {
    const permissionArray = this.sharedService.parsePermissionsObjectToArray(this.permission);
    console.log({permissionArray});
    this.subs.sink = this.projectService.setTeamMemberPermission(this.team.team_uuid, this.selectedMemberUuid, permissionArray).subscribe(res => {
      this.changed.emit();
    });
    this.closeDialog(ref);
  }

  deleteMember(e, index) {
    e.stopPropagation();
    // this.projectService.deleteMember(this.teamID, index);
  }
  selectTab(index) {
    this.permissionTab = index;
  }
  showDialog(ref) {
    this.dialogService.open(ref, {
      closeOnBackdropClick: false,
      closeOnEsc: false
    });
  }
  closeDialog(ref) {
    ref.close();
    this.permission = new Permission();
    this.permissionTab = 0;
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
