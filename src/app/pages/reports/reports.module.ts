import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { PageFooterPageModule } from 'src/app/layout/footer/page-footer.module';
import { ReportsPage } from './reports.page';
import { PipeModule } from 'src/app/core/pipes/pipe.module';
const routes: Routes = [
  {
    path: '',
    component: ReportsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PageFooterPageModule,
    PipeModule,
    RouterModule.forChild(routes),
  ],
  declarations: [ReportsPage]
})
export class ReportsPageModule {}
