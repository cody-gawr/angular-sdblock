import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Routes, RouterModule } from '@angular/router';
import { PageFooterPageModule } from 'src/app/layout/footer/page-footer.module';
import { PipeModule } from 'src/app/core/pipes/pipe.module';
import { NbButtonModule, NbTooltipModule, NbIconModule } from '@nebular/theme';
import { ProjectsPage } from './projects.page';
import { CommonComponentsModule } from 'src/app/components/common.module';

const routes: Routes = [
  {
    path: '',
    component: ProjectsPage
  }
];
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    PageFooterPageModule,
    IonicModule,
    PipeModule,
    NbTooltipModule,
    NbButtonModule,
    NbIconModule,
    CommonComponentsModule,
    RouterModule.forChild(routes),
  ],
  declarations: [ProjectsPage]
})
export class ProjectsPageModule {}
