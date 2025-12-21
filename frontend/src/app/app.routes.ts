import { Routes } from '@angular/router';
import { LandingPage } from './landing-page/landing-page';
import { RecipeDetailComponent } from './recipe-detail/recipe-detail';
import {UserProfileComponent} from './components/user-profile/user-profile';
export const routes: Routes = [
  { path: 'user-info',component: UserProfileComponent,},
  { path: '' , component: LandingPage,},
  { path: 'recipes/:id', component: RecipeDetailComponent },
];
