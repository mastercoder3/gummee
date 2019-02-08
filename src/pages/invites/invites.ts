import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import { map } from 'rxjs/operators';
import { Deal } from '../deal/deal';
import { HelperProvider } from '../../providers/helper/helper';
import { AddDealPage } from '../add-deal/add-deal';
import { InvitedetailsPage } from '../invitedetails/invitedetails';

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
  selector: 'page-invites',
  templateUrl: 'invites.html',
})
export class InvitesPage { 
  deal:Deal;

 

  constructor(public navCtrl: NavController, private api:ApiProvider,
    public navParams: NavParams,private helper:HelperProvider,private router:NavController) {
  }
  user;
  invites;

  ionViewDidLoad() {
    console.log('ionViewDidLoad InvitesPage');
console.log(this.invites);
    this.user = this.navParams.data;
    console.log(this.user);
    this.getInvites();
  }



  handleInvite(item, status){
    this.api.updateDeal(item.id, {
      status:status,
      userId: localStorage.getItem('uid'),
      userName: this.user.name,
    })
  }


  show(x:Deal){
    this.navCtrl.push(AddDealPage,{'deal':x});
  }

  accept(x:Deal){
    this.api.approveInvite(x.id).then(r=>{
      this.helper.toast('Invite accepted successfully');
    })
  }

  reject(x:Deal){
    this.api.deleteInvite(x.id).then(r=>{
      this.helper.toast('invite rejected and removed from your preferences');
    });
  }

  
  getInvites(){
    this.api.getUserInvites(this.user.uid).pipe(
          map(actions => actions.map(a => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            return { id, ...data };
          }))
          ).subscribe(resp=>{
            debugger;
            this.invites = resp;
            console.log(this.invites);

          })
  }

  pp(event ,x){
this.navCtrl.setRoot(InvitedetailsPage, {x:x}); 

 }


}
