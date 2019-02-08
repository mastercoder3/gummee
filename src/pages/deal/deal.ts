import { HelperProvider } from './../../providers/helper/helper';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { ToastController } from 'ionic-angular';

import { Clipboard } from '@ionic-native/clipboard';



import { ApiProvider } from '../../providers/api/api';
import { SocialSharing } from '@ionic-native/social-sharing';
import { AuthProvider } from '../../providers/auth/auth';
import { User } from '../../datamodel/user';
import * as moment from 'moment';
import { ThrowStmt } from '@angular/compiler';
import take from 'rxjs/operator/take';
/**
 * Generated class for the DealPage page.
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
      normalprice?:number;

   isInvite?:boolean;
 }

@IonicPage()
@Component({
  selector: 'page-deal',
  templateUrl: 'deal.html',
})
export class DealPage {

  starIcon:string="star-outline";
  deal:Deal;
  user:User
  constructor(public navCtrl: NavController,private helper:HelperProvider, private api:ApiProvider,
  private clipboard: Clipboard,
  private toastCtrl: ToastController,
    private auth:AuthProvider,
     public navParams: NavParams, private iab:InAppBrowser,private socialSharing: SocialSharing) {

 


  
      let uid=localStorage.getItem('uid');

      if(uid){
        this.api.getProfile(uid).subscribe((r:User)=>{
          this.user={
            email:r.email || '',
            influencer:r.influencer || false,
            name:r.name || '',
            photo:r.photo || '',
            phone:r.phone || '',
            savedDeals:r.savedDeals|| [],
            uid:localStorage.getItem('uid')      
          }
          this.loadUI();  
        })
      }else{
        console.log('no uid found ...user is not logged in');
        this.loadUI();
      }
      





     }

     loadUI(){
      this.deal = this.navParams.data.deal;
      console.log(this.deal);
      let endate=moment(this.deal.endDate);
      let now=moment();
      if(endate <= now){
        console.log('deal expired'); 
        this.deal.isExpired=true;
      }else{
        console.log('deal is active'); 
        this.deal.isExpired=false;
      }
  
      if(this.isDealInFav()==true){
        this.starIcon="star"
      }else{
        this.starIcon="star-outline"
      }
  
     }
  ionViewDidLoad() {

    
  }


  isDealInFav():boolean{
    if(this.user){
      let idx=this.user.savedDeals.findIndex(e=>{
        return e==this.deal.id
      })  
      if(idx>=0){
        return true;
      }else{
        return false;
      }
    }else{
      return false;
    }
    
  }

  goBack(){
    this.navCtrl.pop();
  }

  go(){
    //time to check the type of the dealType i.e  instore || online

    if(this.deal.dealType == 'instore'){
      switch(this.deal.couponType){
        case 'qrcode': {
          this.navCtrl.push('QrCouponPage', this.deal);
          break;
        }
        case 'barcode':{
          this.navCtrl.push('BarcodeCouponPage', this.deal);
          break;

        }
      }
    }else if(this.deal.dealType == 'online'){
      //open this deal in the URL
     window.open(this.deal.url, '_blank', 'location=yes');

    }
  }

  saveFav(){
   //chekc if deal is already saved previously or not
  if(!this.user){
    this.helper.toast('you need to be logged in in order to save the deal')
    return;
  }

   if(this.isDealInFav()==true){
     this.removeFromFavourites();
    
   }else{
        let enddate=moment(this.deal.endDate);
        let now=moment();

      if(enddate <=now){
        console.log('expired deal cannot save');
        this.helper.toast('you cannot save expired deals');
        return;
    }else{
        this.addToFavorites(); 
    }
   }
   
  }


  share(){
    let options = {
      message: 'gunmee app download', // not supported on some apps (Facebook, Instagram)
      subject: 'gunmee app link', // fi. for email
      files: ['www/assets/imgs/logo.png'], // an array of filenames either locally or remotely
      url: 'https://play.google.com/store/apps/details?id=com.whatsapp&hl=en',
      chooserTitle: 'Pick an app', // Android only, you can override the default share sheet title,
      appPackageName: 'com.gumee' // Android only, you can provide id of the App you want to share with
    };

    this.socialSharing.share(options.message,options.subject,options.files,options.url).then(res=>{
      console.log('shared worked');
    },err=>{
      this.helper.toast(err);
    })
    
  }

removeFromFavourites(){

  let idx=this.user.savedDeals.findIndex(e=>{
    return e==this.deal.id
  })  

  if(idx>=0){
    this.user.savedDeals.splice(idx,1);
    this.api.updateProfile(this.user.uid,this.user).then(r=>{
      this.helper.toast("deal removed from favourite");
    },err=>{
      this.helper.toast('error saving deals to favourite');
      
    })
  }else{
    
  }
  
}

  addToFavorites(){
    
      this.user.savedDeals.push(this.deal.id);
      this.api.updateProfile(this.user.uid,this.user).then(e=>{
      this.helper.toast('deal saved in favourites');
      },err=>{
      
      });
    
  }

  copyText(){
    this.clipboard.copy(this.deal.code);
  }
presentToast() {
  let toast = this.toastCtrl.create({
    message: 'Code Copied To Clipboard',
    duration: 3000,
    position: 'bottom'
  });

  toast.onDidDismiss(() => {
    console.log('Dismissed toast');
  });

  toast.present();
}

}
