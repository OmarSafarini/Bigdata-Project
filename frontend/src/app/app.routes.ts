import { Routes } from '@angular/router';
import { LandingPage } from './landing-page/landing-page';
import { RecipeDetailComponent } from './recipe-detail/recipe-detail';
import {UserProfileComponent} from './components/user-profile/user-profile';
import {Signup} from './components/signup/signup';
import {Login} from './components/login/login';
export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'user-info',component: UserProfileComponent,},
  { path: 'signup', component : Signup},
  { path: 'login', component : Login},
  { path: 'home' , component: LandingPage,},
  { path: 'recipes/:id', component: RecipeDetailComponent },
];
