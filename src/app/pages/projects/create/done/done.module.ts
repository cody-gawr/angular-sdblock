import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { NbButtonModule } from '@nebular/theme';

import { DonePage } from './done.page';
import { PageFooterPageModule } from 'src/app/layout/footer/page-footer.module';
import { CommonComponentsModule } from 'src/app/components/common.module';

const routes: Routes = [
  {
    path: '',
    component: DonePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NbButtonModule,
    PageFooterPageModule,
    CommonComponentsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [DonePage]
})
export class DonePageModule {}
