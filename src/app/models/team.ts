import { Permission } from './permission';
import {Deserializable} from './deserializable';

// tslint:disable: variable-name

export class TeamMember implements Deserializable {
  user_uuid?: string;
  name?: string;
  user_role?: string;
  user_payout?: any;
  user_auth_email?: string;
  contract_status?: any;
  permission?: Permission;
  stamp_created: number;
  stamp_created_by?: any;
  stamp_updated?: number;
  stamp_updated_by?: any;
  is_owner?: boolean;
  
  deserialize(input: any) {
    Object.assign(this, input);
    return this;
  }
}

export class Contract implements Deserializable {
  contract_uuid?: string;
  flag_status?: any;
  project_uuid?: any;
  service_uuid?: any;
  stamp_created?: number;
  stamp_updated?: number;
  users?: TeamMember[];
  invites?: any;

  constructor() {
    this.users = new Array<TeamMember>(0);
  }

  deserialize(input: any) {
    Object.assign(this, input);
    this.users = input.users.map(user => new TeamMember().deserialize(user));
    return this;
  }
}


export class Team implements Deserializable {
  team_uuid?: string;
  project_uuid?: string;
  stamp_created?: number;
  stamp_updated?: number;
  users?: TeamMember[];

  constructor() {
    this.users = new Array<TeamMember>(0);
  }

  deserialize(input: any) {
    Object.assign(this, input);
    this.users = input.users.map(user => new TeamMember().deserialize(user));
    return this;
  }
}
