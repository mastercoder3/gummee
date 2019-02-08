import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import * as moment from 'moment';

import { Deal } from '../deal/deal';
import { User } from '../../datamodel/user';
import { SimpleDealsPage } from '../simple-deals/simple-deals';
import { HelperProvider } from '../../providers/helper/helper';

/**
 * Generated class for the FavoritePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-favorite',
  templateUrl: 'favorite.html',
})
export class FavoritePage{
  goBack(){
    this.navCtrl.setRoot(SimpleDealsPage,null,{animate:true,direction:'back'});
  }

  deals:Deal;
  favorites=[];
  user:User;
  constructor(public navCtrl: NavController,private api:ApiProvider,private helper:HelperProvider) {
    
    this.api.getProfile(localStorage.getItem('uid')).subscribe((r:User)=>{
      this.user={
          
        email:r.email || '',
        influencer:r.influencer || false,
        name:r.name || '',
        photo:r.photo || '',
        phone:r.phone || '',
        savedDeals:r.savedDeals|| [],
        uid:localStorage.getItem('uid')

      }
      
    this.getFavoritesDeals();
    })  
  }


show(x){
  console.log(x);
  this.navCtrl.push('DealPage',{'deal':x,'invokedBy':'favorite'},{animate:true,direction:'forward'});
}

getFavoritesDeals(){
  this.api.getUserFavorites(this.user).subscribe((r:Deal)=>{
    let endate=moment(r.endDate);
    let now=moment();

    if(endate <= now){
      console.log('deal expired'); 
      r.isExpired=true;  
    }else{
      console.log('deal is active'); 
      r.isExpired=false;
    }
    this.favorites.push(r);
  })
}


  removeFromFav(deal:Deal){
    let idx;
    
    this.user.savedDeals.forEach((d,i)=>{
      if(d==deal.id){
        idx=i;
      }
    })
    this.user.savedDeals.splice(idx,1);
    this.api.updateProfile(this.user.uid,this.user).then(r=>{
      console.log('deal removed from fav');
      this.helper.toast('deal removed from fav');
      this.favorites.splice(idx,1);
    },err=>{
      console.log('error removing deal');      
    });
  }
}
