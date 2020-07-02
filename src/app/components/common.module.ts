import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NbButtonModule, NbAlertModule, NbTooltipModule, NbCardModule, NbSelectModule, NbBadgeModule } from '@nebular/theme';

import { ChartComponent } from './common/chart/chart.component';
import { MenuComponent } from './common/mobilemenu/mobilemenu.component';
import { UploadFileComponent } from './common/upload-file/upload-file.component';
import { NotificationComponent } from './common/notification/notification.component';
import { UsermenuComponent } from './common/usermenu/usermenu.component';
import { ProfileHeaderComponent } from './common/profile-header/profile-header.component';
import { AlertDialogComponent } from './common/alert-dialog/alert-dialog.component';
import { TicketSidebarComponent } from './ticketbar/ticketbar.component';
import { ToastComponent } from './common/toast/toast.component';

import { PipeModule } from 'src/app//core/pipes/pipe.module';
import { DragDropDirective } from '../core/directives/drag-drop';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PipeModule,
    NbButtonModule,
    NbAlertModule,
    NbTooltipModule,
    NbCardModule,
    NbSelectModule,
    NbBadgeModule,
    ReactiveFormsModule
  ],
  declarations: [ChartComponent, MenuComponent, UploadFileComponent, DragDropDirective, TicketSidebarComponent, UsermenuComponent,
    NotificationComponent, ProfileHeaderComponent, AlertDialogComponent, ToastComponent],
  exports: [ChartComponent, MenuComponent, UploadFileComponent, DragDropDirective, TicketSidebarComponent, UsermenuComponent,
    NotificationComponent, ProfileHeaderComponent, AlertDialogComponent, ToastComponent],
  entryComponents: [MenuComponent]
})
export class CommonComponentsModule { }
