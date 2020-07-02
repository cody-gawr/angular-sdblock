import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, APP_INITIALIZER } from '@angular/core';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { RouteReuseStrategy } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  NbThemeModule, NbIconModule, NbDatepickerModule, NbMenuModule, NbLayoutModule, NbStepperModule, NbButtonModule, NbSelectModule,
  NbAccordionModule, NbAlertModule, NbCardModule, NbTabsetModule, NbDialogModule, NbUserModule, NbTooltipModule, NbTreeGridModule,
  NbToastrModule, NbPopoverModule
} from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';

import { AppComponent } from './ui';
import { AppRoutingModule } from './app-routing.module';

/* Layout components */
import { HeaderPageModule } from './layout/header/header.module';
import { PageFooterPageModule } from './layout/footer/page-footer.module';

/* Common component modules */
import { ProjectComponentsModule } from './components/project.module';
import { CommonComponentsModule } from './components/common.module';
import { NotificationComponent } from './components/common/notification/notification.component';
import { UsermenuComponent } from './components/common/usermenu/usermenu.component';
import { AlertDialogComponent } from './components/common/alert-dialog/alert-dialog.component';
import { ModifyContractComponent } from 'src/app/components/project/dialog/modify-contract/modify-contract.component';

/* Services */
import { StartupService } from './services/shared/startup';

/* Directives */
import { PipeModule } from './core/pipes/pipe.module';

/* Guards */
import { ProjectGuard } from './core/guard/project';

/* Interceptors */
import { JwtInterceptor } from './core/interceptors/jwtInterceptor';

/* Factory */
import { startupServiceFactory } from './core/factories/startup';

@NgModule({
  declarations: [
    // Components
    AppComponent,
  ],
  entryComponents: [NotificationComponent, UsermenuComponent, AlertDialogComponent, ModifyContractComponent],
  imports: [
    // Core modules
    FormsModule, BrowserAnimationsModule, ReactiveFormsModule, HttpClientModule, IonicModule.forRoot(),

    // Nebular modules
    NbSelectModule, NbAccordionModule, NbTabsetModule, NbAlertModule, NbLayoutModule, NbTooltipModule, NbStepperModule, NbUserModule,
    NbButtonModule, NbTreeGridModule, NbCardModule, NbIconModule, NbUserModule, NbEvaIconsModule, NbPopoverModule,
    NbMenuModule.forRoot(), NbDatepickerModule.forRoot(), NbDialogModule.forRoot(), NbThemeModule.forRoot(), NbToastrModule.forRoot(),
    AppRoutingModule,
    HeaderPageModule,
    PageFooterPageModule,
    ProjectComponentsModule,
    CommonComponentsModule,
    PipeModule,
    // BsDropdownModule.forRoot(),
    // ButtonsModule.forRoot()
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    StatusBar,
    SplashScreen,
    ProjectGuard,
    CookieService,
    { provide: APP_INITIALIZER, useFactory: startupServiceFactory, multi: true, deps: [StartupService] },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
