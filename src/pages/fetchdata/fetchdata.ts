import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import { map } from 'rxjs/operators';
import { AddDealPage } from '../add-deal/add-deal';
import { Deal } from '../deal/deal';
import { HelperProvider } from '../../providers/helper/helper';
import { InvitedetailsPage } from '../invitedetails/invitedetails';


@IonicPage()
@Component({
  selector: 'page-fetchdata',
  templateUrl: 'fetchdata.html',
})
export class FetchdataPage { goBack(){ this.navCtrl.push('ProfilePage',null,{animate:true,direction:'back'}) }

  constructor(public navCtrl: NavController, private api:ApiProvider,
    public navParams: NavParams,private helper:HelperProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FetchdataPage');
    this.getMyDeals();
  }



  deals;

  getMyDeals(){
    let id = localStorage.getItem('uid')
    return this.api.getUserDeals(id).pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    ).subscribe(resp=>{
      this.deals = resp;
      console.log(this.deals);

    })
  }

  editDeal(x:Deal){
  this.navCtrl.push(AddDealPage,{'deal':x});
  }

  addDeal(){
    console.log(`adding this deal`);
    this.navCtrl.push(AddDealPage,null,{animate:true,direction:'forward'});
  }

    deleteDeal(x:Deal){
      this.api.deleteDeal(x.id).then(res=>{
        this.helper.toast('deal deleted');
      })
    }

 tour1(event ,x) {
  this.navCtrl.setRoot(InvitedetailsPage,{x:x});
  }


}
