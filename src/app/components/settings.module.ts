import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { NbButtonModule, NbAlertModule, NbSelectModule, NbCardModule, NbDatepickerModule } from '@nebular/theme';

import { SecurityComponent } from './settings/security/security.component';
import { AccountComponent } from './settings/account/account.component';
import { HolderComponent } from './settings/account/holder/holder.component';
import { UpgradeComponent } from './settings/account/upgrade/upgrade.component';
import { CommonComponentsModule } from './common.module';
import { PipeModule } from 'src/app/core/pipes/pipe.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    PipeModule,
    NbButtonModule,
    NbAlertModule,
    NbSelectModule,
    NbCardModule,
    NbDatepickerModule,
    CommonComponentsModule
  ],
  declarations: [SecurityComponent, AccountComponent, HolderComponent, UpgradeComponent],
  exports: [SecurityComponent, AccountComponent, HolderComponent, UpgradeComponent],
})
export class SettingsModule { }
