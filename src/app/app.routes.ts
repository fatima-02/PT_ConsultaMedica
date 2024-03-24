import { Routes } from '@angular/router';
import { PatientFormComponent } from './patient-form/patient-form.component';

import { NotFoundComponent } from './not-found/not-found.component';

export const routes: Routes = [
    { path: '', component: PatientFormComponent },
    { path: 'patient', component: PatientFormComponent },
    { path: '**', component: NotFoundComponent }
];
