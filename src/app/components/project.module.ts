import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { NbUserModule, NbTreeGridModule, NbCardModule, NbDialogModule, NbButtonModule, NbSelectModule, 
  NbAlertModule, NbTooltipModule } from '@nebular/theme';

import { PipeModule } from '../core/pipes/pipe.module';
import { CommonComponentsModule } from 'src/app/components/common.module';
import { AssettableComponent } from './project/table/assettable/assettable.component';
import { TeamtableComponent } from './project/table/teamtable/teamtable';
// Layouts
import { HistorybarComponent } from './project/layout/historybar/historybar';
import { TabheaderComponent } from './project/layout/tabheader/tabheader';
import { InfoheaderComponent } from './project/layout/infoheader/infoheader.component';
// Dialogs
import { HistorydialogComponent } from './project/dialog/historydialog/historydialog.component';
import { FilehistoryComponent } from './project/dialog/filehistory/filehistory.component';
import { OrganizeComponent } from './project/dialog/collection/organize/organize.component';
import { FolderComponent } from 'src/app/components/project/dialog/collection/folder/folder.component';
import { UploadComponent } from 'src/app/components/project/dialog/collection/upload/upload.component';
import { ConfirmComponent } from 'src/app/components/project/dialog/collection/confirm/confirm.component';
import { DetailComponent } from 'src/app/components/project/dialog/collection/detail/detail.component';
import { SummaryComponent } from 'src/app/components/project/dialog/collection/summary/summary.component';
import { QueuedialogComponent } from 'src/app/components/project/dialog/collection/queuedialog/queuedialog.component';
import { BlockchainComponent } from 'src/app/components/project/dialog/blockchain/blockchain.component';
import { ModifyContractComponent } from 'src/app/components/project/dialog/modify-contract/modify-contract.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NbUserModule,
    NbTreeGridModule,
    PipeModule,
    NbCardModule,
    NbDialogModule,
    NbButtonModule,
    NbSelectModule,
    NbAlertModule,
    NbTooltipModule,
    DragDropModule,
    ReactiveFormsModule,
    CommonComponentsModule
  ],
  entryComponents: [ OrganizeComponent, FolderComponent, UploadComponent, ConfirmComponent, FilehistoryComponent, HistorydialogComponent,
    DetailComponent, SummaryComponent, BlockchainComponent, QueuedialogComponent ],
  declarations: [HistorybarComponent, TabheaderComponent, TeamtableComponent, AssettableComponent, InfoheaderComponent,
    HistorydialogComponent, FilehistoryComponent, OrganizeComponent, FolderComponent, UploadComponent, ConfirmComponent,
    DetailComponent, SummaryComponent, BlockchainComponent, ModifyContractComponent, QueuedialogComponent],
  exports: [HistorybarComponent, TabheaderComponent, TeamtableComponent, AssettableComponent, InfoheaderComponent,
    HistorydialogComponent, FilehistoryComponent, OrganizeComponent, FolderComponent, BlockchainComponent, ModifyContractComponent,
    QueuedialogComponent],
})
export class ProjectComponentsModule { }
