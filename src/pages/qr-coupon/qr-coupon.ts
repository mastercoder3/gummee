import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the QrCouponPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-qr-coupon',
  templateUrl: 'qr-coupon.html',
})
export class QrCouponPage { goBack(){ this.navCtrl.pop(); }

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }
  deal;
  value = 'Techiediaries';
  elementType = 'url';


  ionViewDidLoad() {
    console.log('ionViewDidLoad QrCouponPage');
    this.deal = this.navParams.data;
    this.value = this.deal.code;
  }


  openLink(url){
    window.open(this.deal.url, '_blank', 'location=yes');
  }
}



