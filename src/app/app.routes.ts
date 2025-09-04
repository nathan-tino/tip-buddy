
import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ShiftsComponent } from './shifts/shifts.component';
import { RegisterComponent } from './register/register.component';

export const routes: Routes = [
	{ path: '', component: LoginComponent },
    { path: 'login', component: LoginComponent },
    { path: 'shifts', component: ShiftsComponent },
    { path: 'register', component: RegisterComponent }
];
