import { Component } from '@angular/core';
import { BaseComponent } from 'src/app/core/core.base';
import { SocialMedialService } from '../services/socialMedia.Service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html'
})
export class LandingComponent extends BaseComponent {


  constructor(public smSVC: SocialMedialService) {
    super();
  }


  public SignUpGoogle() {
    (<HTMLElement>document.getElementById('gSignIn').firstChild).click();
  }

  public SignOutGoogle() {
    this.smSVC.gSignOut();
  }

  test() {
    console.log(this.ActiveUser)
  }
}
