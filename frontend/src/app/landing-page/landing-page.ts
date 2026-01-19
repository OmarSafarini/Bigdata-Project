import { Component } from '@angular/core';
import { Homepage } from '../homepage/homepage';
import { RouterLink, RouterModule } from "@angular/router";

@Component({
  selector: 'app-landing-page',
  imports: [Homepage, RouterLink, RouterModule],
  templateUrl: './landing-page.html',
  styleUrls: ['./landing-page.css'],  // ✅ جمع
})
export class LandingPage {

}
