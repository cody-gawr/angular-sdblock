import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { NbButtonModule, NbSelectModule, NbAlertModule, NbDatepickerModule } from '@nebular/theme';

import { PageFooterPageModule } from 'src/app/layout/footer/page-footer.module';
import { CommonComponentsModule } from 'src/app/components/common.module';
import { ProjectPage } from './project.page';

const routes: Routes = [
  {
    path: '',
    component: ProjectPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NbButtonModule,
    NbSelectModule,
    NbAlertModule,
    NbDatepickerModule,
    PageFooterPageModule,
    ReactiveFormsModule,
    CommonComponentsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ProjectPage]
})
export class ProjectPageModule {}
