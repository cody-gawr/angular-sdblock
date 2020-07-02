import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ContractPageRoutingModule } from './contract-routing.module';
import { NbButtonModule, NbSelectModule, NbCardModule, NbDialogModule } from '@nebular/theme';

import { ContractPage } from './contract.page';
import { PageFooterPageModule } from 'src/app/layout/footer/page-footer.module';
import { CommonComponentsModule } from 'src/app/components/common.module';
import { ProjectComponentsModule } from 'src/app/components/project.module';
import { ModifyContractComponent } from 'src/app/components/project/dialog/modify-contract/modify-contract.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NbButtonModule,
    NbDialogModule,
    PageFooterPageModule,
    CommonComponentsModule,
    ProjectComponentsModule,
    ContractPageRoutingModule
  ],
  declarations: [ContractPage],
  entryComponents: [ModifyContractComponent]
})
export class ContractPageModule {}
