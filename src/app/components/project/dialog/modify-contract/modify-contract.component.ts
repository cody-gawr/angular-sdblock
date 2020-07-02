import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, NgForm } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { SubSink } from 'subsink';

import { ProjectService } from 'src/app/services/project/project';
import { ChartService } from 'src/app/services/contract/chart';

import { Contract } from 'src/app/models/team';
import { Permission } from 'src/app/models/permission';

import * as _ from 'lodash';

@Component({
  selector: 'app-modify-contract',
  templateUrl: './modify-contract.component.html',
  styleUrls: ['./modify-contract.component.scss'],
})
export class ModifyContractComponent implements OnInit, OnDestroy {
  @Input() projectId: any;
  @Input() contract: Contract;
  @Input() teamPermission?: Permission;
  @Input() action?: any;

  private subs = new SubSink();

  formGroup: FormGroup;

  members: {
    name: string,
    email: string,
    payout: number,
    role: string
  }[];

  chartData = [100];
  chartLabels = ['Unallocated'];
  unalloc: any;

  submitted: boolean;

  payoutFull = false;
  wrongValue: any = false;

  alert = false;
  returnUrl: any;
  isEmpty: boolean;

  roles: any = ['Admin', 'Band Member', 'Booking Agent', 'Composer', 'Designer', 'Investor', 'Label', 'Lawyer', 'Manager',
    'Owner', 'Publisher', 'Writer', '(Other)'];
  
  constructor(
    public formBuilder: FormBuilder,
    private modalController: ModalController,
    private projectService: ProjectService,
    private chartService: ChartService,
  ) { }

  ngOnInit() {
    console.log(this.projectId);
    console.log(this.contract);
    this.members = _.cloneDeep(this.contract.users.filter(user => user.user_payout).map(user => {
      return {name: user.name, email: user.user_auth_email, role: user.user_role, payout: user.user_payout};
    }));
    this.initFormGroup();
    this.parseData();
  }

  get formMembers(): any {
    return this.formGroup.controls.members as FormArray;
  }

  parseData() {
    this.unalloc = 100;
    this.chartData = [];
    this.chartLabels = [];
    this.members.forEach(element => {
      this.chartLabels.push(element.name);
      this.chartData.push(element.payout);
      this.unalloc -= element.payout;
    });
    this.chartData.unshift(this.unalloc);
    this.chartLabels.unshift('Unallocated');
    this.chartService.updateChartData(this.projectId, this.chartLabels, this.chartData);
    if (this.chartData[0] == 0) {
      this.payoutFull = true;
    }
  }

  initFormGroup() {
    this.formGroup = this.formBuilder.group({
      members: this.formBuilder.array([])
    });
    for (const member of this.members) {
      this.formMembers.push(this.createMemberFormGroup(member));
    }
    if (this.members.length === 0) {
      this.formMembers.push(this.createMemberFormGroup());
    }
  }

  createMemberFormGroup(member?) {
    if (member) {
      return this.formBuilder.group({
        name: [member.name, Validators.required],
        email: [member.email, Validators.required],
        role: [member.role, Validators.required],
        payout: [member.payout, [Validators.required, Validators.pattern(/[0-9]+/), Validators.max(100)]]
      });
    }
    return this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
      role: ['', Validators.required],
      payout: ['', [Validators.required, Validators.pattern(/[0-9]+/), Validators.max(100)]]
    });
  }

  onPayout(formGroup, i) {
    if (! formGroup.valid || !this.formGroup.valid) {
      console.log('invalid', formGroup);
      return;
    }

    // Get values from forms fields
    const formData: any = {
      name: formGroup.controls.name.value,
      role: formGroup.controls.role.value,
      email: formGroup.controls.email.value,
      payout: parseInt(formGroup.controls.payout.value, 10)
    };

    // Get Unallocated Value
    if (formData.payout > 100) {
      this.wrongValue = true;
      setTimeout(() => {
        this.wrongValue = false;
      }, 5000);
      return;
    }

    const isPossible = this.canAddMember(formData, i);
    if (isPossible) {
      this.updateMemberData(formData, i);
    } else {
      this.formMembers.controls[i].controls.payout.setValue(this.members[i].payout);
    }
  }

  canAddMember(data, index) {
    let sum = 0;
    if (index >= this.members.length) {
      sum = _.sum(this.chartData) - this.chartData[0] + data.payout;
    } else {
      sum = _.sum(this.chartData) - this.chartData[0] - this.chartData[index + 1] + data.payout;
    }
    if (sum > 100) {
      this.wrongValue = true;
      setTimeout(() => {
        this.wrongValue = false;
      }, 5000);
    }
    return sum <= 100;
  }

  checkPayoutDistribution() {
    let sum = 0;
    for (const member of this.members) {
      sum += member.payout;
    }
    if (sum > 100) {
      this.wrongValue = true;
      setTimeout(() => {
        this.wrongValue = false;
      }, 5000);
      return false;
    } else if (sum < 100) {
      this.payoutFull = false;
      setTimeout(() => {
        this.payoutFull = true;
      }, 5000);
      return false;
    }
    return true;
  }
  updateMemberData(data, i) {
    if (i >= this.members.length) {
      this.members.push(data);
    } else {
      this.members[i] = data;
    }
    this.parseData();
  }

  addMember() {
    console.log('add member');
    this.formMembers.push(this.createMemberFormGroup());
  }

  deleteMember(index) {
    this.formMembers.removeAt(index);
    this.members.splice(index, 1);
    this.parseData();
  }

  onSubmit(formGroup) {
    console.log('submit');
    this.submitted = true;
    if (!formGroup.valid) {
      console.log('invalid form', formGroup);
      return;
    }
    if (!this.checkPayoutDistribution()) {
      console.log('payout distribution error', this.members);
      return;
    }
    console.log(this.members);
    this.modalController.dismiss({
      data: this.members
    });
  }
  close() {
    this.modalController.dismiss();
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
