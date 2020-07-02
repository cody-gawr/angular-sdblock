import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { SubSink } from 'subsink';

import { Contract } from 'src/app/models/team';
import { ProfileService } from 'src/app/services/account/profile';
import { ProjectService } from 'src/app/services/project/project';
import { ModifyContractComponent } from 'src/app/components/project/dialog/modify-contract/modify-contract.component';

@Component({
  selector: 'app-contract',
  templateUrl: './contract.page.html',
  styleUrls: ['./contract.page.scss'],
})
export class ContractPage implements OnInit, OnDestroy {
  private subs = new SubSink();

  contractObs: Observable<any>;
  contract: any;
  userInfo: any;
  userContract: any;
  services: any[];

  projectId: string;
  hasContractPermission = false;
  constructor(
    private activatedRoute: ActivatedRoute,
    private modalController: ModalController,
    private router: Router,
    private projectService: ProjectService,
    private profileService: ProfileService,
  ) { }

  ngOnInit() {
    this.subs.sink = this.profileService.getBasicUserInfo().subscribe(res => {
      this.userInfo = res;
    });
    this.subs.sink = this.profileService.getBasicUserServicesInfo().subscribe(res => {
      this.services = res;
    });
    this.subs.sink = this.activatedRoute.params.subscribe(params => {
      this.projectId = params.id;
      this.getContractData();
      this.subs.sink = this.projectService.getProjectService(this.projectId).subscribe(service => {
        console.log({service});
        this.checkContractPermission(service.service_uuid);
      });
    });
  }

  getContractData() {
    this.contractObs = this.projectService.getProjectContract(this.projectId);
    this.subs.sink = this.contractObs.subscribe(contract => {
      console.log({contract});
      this.userContract = contract.users.find(x => x.user_uuid == this.userInfo.user_uuid);
    });
  }

  checkContractPermission(serviceUuid) {
    const service = this.services.find(x => x.service.service_uuid == serviceUuid);
    this.hasContractPermission = false;
    for (const permission of service.permissions) {
      if (permission.permission_name == 'App.Soundblock.Service.Project.Contract' && permission.permission_value) {
        this.hasContractPermission = true;
      }
    }
  }

  acceptContract(contract) {
    this.subs.sink = this.projectService.acceptProjectContract(contract.contract_uuid).subscribe(res => {
      console.log({res});
      this.getContractData();
    });
  }

  rejectContract(contract) {
    this.subs.sink = this.projectService.rejectProjectContract(contract.contract_uuid).subscribe(res => {
      console.log({res});
      this.getContractData();
    });
  }

  async modifyContract(contract) {
    console.log({contract});
    const modal = await this.modalController.create({
      component: ModifyContractComponent,
      componentProps: {
        projectId: this.projectId,
        contract,
      }
    });
    modal.onDidDismiss().then(result => {
      if (result.data) {
        this.contractObs = this.projectService.updateProjectContract(this.projectId, result.data);
      }
    });
    return await modal.present();
  }

  async createContract() {
    const modal = await this.modalController.create({
      component: ModifyContractComponent,
      componentProps: {
        projectId: this.projectId,
        contract: new Contract()
      }
    });
    modal.onDidDismiss().then(result => {
      if (result.data) {
        this.contractObs = this.projectService.updateProjectContract(this.projectId, result.data);
      }
    });
    return await modal.present();
  }
  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
