import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { NbStepperModule, NbButtonModule } from '@nebular/theme';
import { PasswordRecoveryPage } from './password-recovery.page';
import { PageFooterPageModule } from '../../../layout/footer/page-footer.module';

const routes: Routes = [
  {
    path: '',
    component: PasswordRecoveryPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    NbStepperModule,
    NbButtonModule,
    PageFooterPageModule,
  ],
  declarations: [PasswordRecoveryPage]
})
export class PasswordRecoveryPageModule {}
