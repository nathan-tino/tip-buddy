
import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ShiftsComponent } from './shifts/shifts.component';
import { RegisterComponent } from './register/register.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
	{
		path: '',
		canActivate: [AuthGuard],
		component: ShiftsComponent
	},
	{ path: 'login', component: LoginComponent },
	{
		path: 'shifts',
		canActivate: [AuthGuard],
		component: ShiftsComponent
	},
	{ path: 'register', component: RegisterComponent }
];
