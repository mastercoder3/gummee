import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Deal } from '../../pages/deal/deal';
import { User } from '../../datamodel/user';
import { Observable } from 'rxjs/Observable';
import { pipe } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/storage';


/*
  Generated class for the ApiProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ApiProvider {

  constructor(private afs:AngularFirestore,private storage:AngularFireStorage) {
    console.log('Hello ApiProvider Provider');
    //set dummy ID
    console.log(localStorage.getItem('uid'))
  }



  /* ----------------- USERS ------------ */
  createProfile(uid, data){
  return  this.afs.doc('users/'+uid).set(data);
    
  }

  updateUid(uid){
    return this.afs.doc('users/'+uid).update({
      uid:uid
    })
  }

  getProfile(uid){
    return this.afs.doc('users/'+ uid).valueChanges();
  }

  getProfilePic(uid){
    return this.storage.ref('profile/'+uid).getDownloadURL();
  }

  updateProfile(uid, info){
    
    return this.afs.doc('users/'+uid).update(info);
  }



  /* ---------------DEALS--------------- */


  // ADD DEALS

  getDeals(){
    return this.afs.collection('deals').snapshotChanges();

  }


  getDeal(id){
    return this.afs.doc('deals').valueChanges();
  }

  getUserInvites(id){
    return this.afs.collection('deals', ref=> ref.where('userId','==',id).where('isInvite','==',true)).snapshotChanges();
  }

  getUserDeals(id){
    return this.afs.collection('deals', ref=> ref.where('userId','==',id)).snapshotChanges();
  }
  getApprovedDeals(){
    return this.afs.collection('deals', ref=> ref.where('approved','==','approved')).snapshotChanges();
  }

  addDeal(data){
    
    return this.afs.collection('deals').add(data);
  }
  updateDeal(id,data){
    return this.afs.doc('deals/'+id).update(data);
  }

deleteDeal(id){
  return this.afs.doc('deals/'+id).delete();
}



/* --------------- CATEGORIES -------------------- */


getAllCategories(){
  return this.afs.collection('categories').snapshotChanges();
}

// getOnlineCategories(){
//   return this.afs.collection('categories', ref=> ref.where('type','==','online')).snapshotChanges();
// }
// getInstoreCategories(){
//   return this.afs.collection('categories', ref=> ref.where('type','==','instore')).snapshotChanges();
// }


/* --------------- FAVORITES -------------------- */
getUserFavorites(user:User){
  //return this.afs.collection('favorites', ref=> ref.where('userId','==',localStorage.getItem('uid'))).valueChanges();
  return new Observable(o=>{
    let deals:Deal[];
    
    let dealsCollection=this.afs.collection<Deal>('deals');
    user.savedDeals.forEach(e=>{
      dealsCollection.doc(e).valueChanges().subscribe(r=>{
        o.next(r)
      });
    })
    
  });
}


addUserFavorite(dealId:string){

  return new Promise((resolve,reject)=>{
      
  });
}

addFavorite(deal:Deal){
  return this.afs.collection('favorites').add(deal);
}

removeFavourite(deal:Deal){
  return this.afs.collection('favorites').doc(deal.id).delete();
}

/* INIVTES */

getInvites(){
  let id = localStorage.getItem('uid');
  return this.afs.collection('deals', ref=> ref.where('userId','==',id)).snapshotChanges();
}
getInvite(id){
  return this.afs.doc('invites/'+id).valueChanges();
}

approveInvite(id){ /*  approved | pending  */
  return this.afs.doc('deals/'+id).update({
    approved:'approved'
  });
}

approveInvite2(id){ /*  approved | pending  */
  return this.afs.doc('deals/'+id).update({
    approved:'Accepted'
  });
}

deleteInvite(id){
  return this.afs.doc('deals/'+id).delete();

}

updateInvite(id, data){
  return this.afs.doc('invites/'+id).update(data);
}
}
