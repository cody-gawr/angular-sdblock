import {Deserializable} from './deserializable';
import { Project } from './project';

// tslint:disable: variable-name

export class Payout {
  name: any;
  email: any;
  role: any;
  payout: number;
}


export class CustomContract implements Deserializable {
  payment_message?: string;
  name?: string;
  email?: string;
  phone?: string;

  deserialize(input: any) {
    Object.assign(this, input);
    return this;
  }
}

export class Payment implements Deserializable {
  members?: Payout[];
  custom_contract_rules?: CustomContract;

  constructor() {
    this.members =  new Array<Payout>(0);
    this.custom_contract_rules = new CustomContract();
  }

  deserialize(input: any) {
    Object.assign(this, input);
    this.custom_contract_rules = new CustomContract().deserialize(input.custom_contract_rules);
    return this;
  }
}

export class ProjectInfo implements Deserializable {
  project_title?: string;
  project_type?: any;
  project_avatar?: string;
  project_date?: Date;
  project_genre?: any;
  project_subgenres?: any[];

  constructor() {
  }

  deserialize(input: any) {
    Object.assign(this, input);
    return this;
  }
}

export class Draft implements Deserializable {
  service: any;
  step: number;
  draft?: string;
  project?: ProjectInfo;
  payment?: Payment;

  constructor() {
    this.service = '';
    this.step = 1;
    this.project = new ProjectInfo();
    this.payment = new Payment();
  }

  deserialize(input: any) {
    Object.assign(this, input);
    this.payment = new Payment().deserialize(input.payment);
    this.project = new ProjectInfo().deserialize(input.project);
    return this;
  }
}
