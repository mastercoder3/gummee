import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';

/**
 * Generated class for the BarcodeCouponPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-barcode-coupon',
  templateUrl: 'barcode-coupon.html',
})
export class BarcodeCouponPage { goBack(){ this.navCtrl.pop(); }

  constructor(public navCtrl: NavController, private iab:InAppBrowser,
     public navParams: NavParams) {
  }


  value='23232';


  deal;
  ionViewDidLoad() {
    console.log('ionViewDidLoad BarcodeCouponPage');
    this.deal = this.navParams.data;
    this.value = this.deal.code;

  }

  goPage(url){
    console.log(url);
    this.iab.create('').show();


  }

}
