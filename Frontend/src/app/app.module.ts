import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AppConfigService } from '../app/services/app-config.service';
import { LoginComponent } from './login/login.component';
import { ExportMaterialModules } from '../imports/material-module';
import { LoginServiceService } from './services/login-service.service'
import { FilterControlsService } from './services/filter-controls.service';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { PatientComponent } from './patient/patient.component';
import { ProfileComponent } from './profile/profile.component';
import { DisplayMessageDialogueComponent } from './display-message-dialogue/display-message-dialogue.component';
import { PatientListComponent } from './patient-list/patient-list.component';
import { PatientDailyLogComponent } from './patient-daily-log/patient-daily-log.component';
import { GpListComponent } from './gp-list/gp-list.component';
import { ConsultationDialogComponent } from './consultation-dialog/consultation-dialog.component'

export function initializeApp(appConfig: AppConfigService):any {
  return () => appConfig.load();
}
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HeaderComponent,
    FooterComponent,
    PatientComponent,
    ProfileComponent,
    DisplayMessageDialogueComponent,
    PatientListComponent,
    PatientDailyLogComponent,
    GpListComponent,
    ConsultationDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,    
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    ExportMaterialModules
  ],
  providers: [
    AppConfigService,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [AppConfigService], multi: true
    },
    LoginServiceService,
    FilterControlsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
