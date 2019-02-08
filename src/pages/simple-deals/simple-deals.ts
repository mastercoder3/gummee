import { CategoryPage } from './../category/category';
import { Component } from '@angular/core';
import { NavController, MenuController, NavParams } from 'ionic-angular';
import { AlertController } from 'ionic-angular';

import { ApiProvider } from '../../providers/api/api';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AddDealPage } from '../add-deal/add-deal';
import * as moment from 'moment';
import { AuthProvider } from '../../providers/auth/auth';
import { AngularFirestore } from '@angular/fire/firestore';


import { HelperProvider } from '../../providers/helper/helper';
import { Deal } from '../deal/deal';



@Component({
  selector: 'page-simple-deals',
  templateUrl: 'simple-deals.html',
})


export class SimpleDealsPage  { goBack(){ this.navCtrl.pop(); }
selection:string="all";
category:string="mob";

deals:Deal[]=[];
filteredDeals:Deal[]=[];
user;
userInput:string;

showSearchBar:boolean=false;
checked:Array<boolean> = [
true,false,false,false,false
];
seg1;
seg2;
seg3;
constructor(public navCtrl: NavController,private menuCtrl:MenuController,public alertController: AlertController,
  private api:ApiProvider,private authSvc:AuthProvider,private helper:HelperProvider,private afs:AngularFirestore) {
  this.getDeals();

  
}


ngAfterViewInit(): void {
 let url:string=document.URL;

 if(url.indexOf('=') !== -1){
   console.log(url);
   let token=url.substr(url.indexOf('=')+1,url.length);
   console.log(token);
  this.authSvc.getInstagramProfile(token).then(r=>{
    console.log(r);
  this.helper.presentAlert('instagram user profile',JSON.stringify(r),'ok');

  },err=>{
  this.helper.toast('error while fetching instagram profile. error is :'+ err);
    console.log(err);
    
  })
 }
  
  
}






goCategory(){
  this.navCtrl.push(CategoryPage);
}
ionViewWillEnter() { this.menuCtrl.enable(true) }



addDeal(){
  console.log(`adding this deal`);
  this.navCtrl.push(AddDealPage);
  }

show(x){
console.log(x);
this.navCtrl.push('DealPage',{'deal':x,'invokedBy':'simple-deal'});
}

getProfile(){
this.api.getProfile(localStorage.getItem('uid')).subscribe(resp=>{
this.user =resp;
});
}

changeSearchBar(){
  
  if(this.showSearchBar){
    this.showSearchBar=false;
    let evt={value:this.selection};
    this.segmentChanged(evt);
  }else{
    this.showSearchBar=true;
  }
}



getDeals(){
this.api.getApprovedDeals().pipe(
  map(actions => actions.map(a => {
    const data = a.payload.doc.data();
    const id = a.payload.doc.id;

    // let liked = false;
    // let found = this.user.likes.find((element)=> {
    //   return element.id == localStorage.getItem('uid')
    // })
    // if(found){
    //   liked =true;
    // }
    return { id, ...data };
  }))
).subscribe(resp=>{
  console.log(resp);
  this.deals = resp;
  this.filteredDeals=resp;
  this.seg1 = this.deals;
  this.seg2 = this.deals;
  this.seg3 = this.deals;
});
}

searchFilter(){
  let tmp=[];
  if(this.selection!=='all'){
    tmp=this.deals.filter(ele=>{
      return ele.dealType==this.selection
    })
  }else{
    tmp=this.deals;
  }

  this.filteredDeals=tmp.filter((ele,idx)=>{
    if(ele.brand && ele.brand.toLowerCase().includes(this.userInput.toLowerCase())){
      return ele;
     }else if(ele.title && ele.title.toLowerCase().includes(this.userInput.toLowerCase())){
      return ele;
     }
     else if(ele.userName && ele.userName.toLowerCase().includes(this.userInput.toLowerCase())){
      return ele;
     }
     else if(ele.brand && ele.brand.toLowerCase().includes(this.userInput.toLowerCase())){
      return ele;
     }
     //else if(ele.description && ele.description.toLowerCase().includes(this.userInput.toLowerCase())){
    //   return ele;
    // }
  })
}

segmentChanged(evt:any){
  if(this.selection ==="online"){
    this.setCategoryFilter(this.seg1)
    let x =this.filteredDeals.filter(data => data.dealType === 'online')
    this.filteredDeals = x;
    this.seg1 = x;
  }else if(this.selection=="instore"){
    this.setCategoryFilter(this.seg2)
    let x=this.filteredDeals.filter(data => data.dealType === 'instore')
    this.filteredDeals = x;
    this.seg2 = x;
  }else{
    this.setCategoryFilter(this.seg3)
    let x = this.filteredDeals;
    this.seg3 = x;
  }
}

  setCategoryFilter(deal){
    if(this.checked[0]){
      this.filteredDeals = this.deals;
    }
    if(this.checked[1]){
      let x = deal.filter(data => data.categoryName === 'Mobile and Electronics')
      this.filteredDeals.push(...x);
    }
    if(this.checked[2]){
      let x = deal.filter(data => data.categoryName === 'Foods')
      this.filteredDeals.push(...x)
    }
    if(this.checked[3]){
      let x = deal.filter(data => data.categoryName === 'Clothing')
      this.filteredDeals.push(...x)
    }
    if(this.checked[4]){
      let x = deal.filter(data => data.categoryName === 'Toys & Kids')
      this.filteredDeals.push(...x)
    }
  }






 async presentAlertCheckbox() {
    const alert = await this.alertController.create({
      title: 'Select Category',
      inputs: [

              {
          name: 'checkbox1',
          type: 'checkbox',
          label: 'All',
          value: 'all',
          checked: this.checked[0]
        },

        {
          name: 'checkbox1',
          type: 'checkbox',
          label: 'Mobile and Electronics',
          value: 'Mobile and Electronics',
          checked: this.checked[1]
          
        },

        {
          name: 'checkbox2',
          type: 'checkbox',
          label: 'Foods',
          value: 'Foods',
          checked: this.checked[2]
        },

        {
          name: 'checkbox3',
          type: 'checkbox',
          label: 'Clothing',
          value: 'Clothing',
          checked: this.checked[3]
        },

        {
          name: 'checkbox4',
          type: 'checkbox',
          label: 'Toys & Kids',
          value: 'Toys & Kids',
          checked: this.checked[4]
        }

   
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Ok',
          handler: (res) => {
            this.setChecked(res);
            if(res.length !== 0){
              if(!res.includes('all')){
              this.filteredDeals = [];
              for(let i =0; i< res.length; i++){
                let x = this.deals.filter(data => data.categoryName === res[i])
                this.filteredDeals.push(...x);
                console.log(this.filteredDeals)
              }
            }
            else
              this.filteredDeals = this.deals.filter(data => data.dealType === this.selection);
          }
          }
        }
      ]
    });

    await alert.present();
  }

  setChecked(check){
    this.checked[0] = check.includes('all');
    this.checked[1] = check.includes('Mobile and Electronics');
    this.checked[2] = check.includes('Foods');
    this.checked[3] = check.includes('Clothing');
    this.checked[4] = check.includes('Toys & Kids');
    
  }




}
