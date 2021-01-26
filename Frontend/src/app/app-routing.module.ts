import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GpListComponent } from './gp-list/gp-list.component';
import { LoginComponent } from './login/login.component';
import { PatientDailyLogComponent } from './patient-daily-log/patient-daily-log.component';
import { PatientListComponent } from './patient-list/patient-list.component';
import { PatientComponent } from './patient/patient.component';
import { ProfileComponent } from './profile/profile.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'patient', component: PatientComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'patientlist', component: PatientListComponent },
  { path: 'patientdailylist', component: PatientDailyLogComponent },
  { path: 'gplist', component: GpListComponent },
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
