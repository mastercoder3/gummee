import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage { goBack(){ this.navCtrl.pop(); }

  constructor(public navCtrl: NavController) {

  }

}
