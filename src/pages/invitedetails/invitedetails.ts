import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SimpleDealsPage } from '../simple-deals/simple-deals';
import { ApiProvider } from '../../providers/api/api';
import { HelperProvider } from '../../providers/helper/helper';


/**
 * Generated class for the InvitedetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
 export interface Deal{
   approved?:string;
   brand?:string;
   brandPhone?:string;
   categoryId?:string;
   categoryName?:string;
   code?:string;
   couponType?:string;
   dealType?:string;
   description?:string;
   endDate?:string;
   id?:string;
   timestamp?:string;
   title?:string;
   url?:string;
   photo?:string;
   userName?:string;
   userId?:string;
   userPhoto?:string;
   isExpired?:boolean;
   startDate?:string;
   price?:number;
   isInvite?:boolean;
 }


@IonicPage()
@Component({
  selector: 'page-invitedetails',
  templateUrl: 'invitedetails.html',
})
export class InvitedetailsPage { 

inv: any;

  constructor(public navCtrl: NavController, private helper:HelperProvider, public navParams: NavParams,
  private api:ApiProvider,) {

  this.inv = this.navParams.get('x');
  console.log(this.inv);

  }





 
  ionViewDidLoad() {
    console.log('ionViewDidLoad BarcodeCouponPage');
    console.log('this.inv');

  

  }


Back(){
	this.navCtrl.setRoot(SimpleDealsPage);
}

  accept(inv:Deal){
    this.api.approveInvite2(inv.id).then(r=>{
      this.helper.toast('Invite accepted successfully');
    })
  }




  reject(inv:Deal){
    this.api.deleteInvite(inv.id).then(r=>{
      this.helper.toast('invite rejected and removed from your preferences');
    });
  }

}
