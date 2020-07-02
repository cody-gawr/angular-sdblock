import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NbButtonModule } from '@nebular/theme';
import { IonicModule } from '@ionic/angular';
import { ReadyPage } from './ready.page';
import { Routes, RouterModule } from '@angular/router';
import { PageFooterPageModule } from 'src/app/layout/footer/page-footer.module';

const routes: Routes = [
  {
    path: '',
    component: ReadyPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NbButtonModule,
    PageFooterPageModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ReadyPage]
})
export class ReadyPageModule {}
