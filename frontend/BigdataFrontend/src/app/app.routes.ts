import { Routes } from '@angular/router';
import { LandingPage } from './landing-page/landing-page';
import {UserProfileComponent} from './components/user-profile/user-profile';

export const routes: Routes = [
    { path: '', component: LandingPage },
  {
    path: '',
    component: UserProfileComponent,
  }
];
