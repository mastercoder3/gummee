import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { ApiProvider } from '../../providers/api/api';
import { HelperProvider } from '../../providers/helper/helper';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { MyApp } from '../../app/app.component';
import { SimpleDealsPage } from '../simple-deals/simple-deals';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { RegisterinfluencerPage } from '../registerinfluencer/registerinfluencer';

import { AngularFirestore } from '@angular/fire/firestore';



import firebase from 'firebase';


@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
 err:any;
 resultado_facebook:any;
 token:string;
  constructor(private events:Events,private iab:InAppBrowser,private navCtrl: NavController, private auth:AuthProvider,private api:ApiProvider,private helper:HelperProvider, public fb: Facebook, private afs: AngularFirestore,
    private navParams: NavParams) {
  }
  goBack(){
    this.navCtrl.pop();
   }

  facebookLogin() {
 
 this.fb.login(['public_profile', 'email'])
  .then((retorno: FacebookLoginResponse) => {
    const facebookCredential = firebase.auth.FacebookAuthProvider.credential(retorno.authResponse.accessToken);

    firebase.auth().signInAndRetrieveDataWithCredential(facebookCredential)
                        .then(credential => {
                           this.resultado_facebook = credential.user;
                           console.log(this.resultado_facebook);
                           console.log('UID = ', this.resultado_facebook.uid);
                           console.log('email = ', this.resultado_facebook.email);
                           console.log('name = ', this.resultado_facebook.displayName);

             const userr = { uid: this.resultado_facebook.uid, email:this.resultado_facebook.email, name:this.resultado_facebook.displayName,influencer: false,phone: '',savedDeals:'' }
                          this.afs.doc(`users/${this.resultado_facebook.uid}`).set(userr);


                         })
   })

}

  user={
    email:'',
    password:''
  }

  ionViewDidLoad() {
     
 
    
  }
  
  login(){
    this.helper.load();
    this.auth.login(this.user.email, this.user.password).then((resp:any)=>{
      this.auth.saveToken(resp.user.uid);
        
        //this.navCtrl.setRoot(MyApp);
        this.navCtrl.setRoot(SimpleDealsPage);
        //this.navCtrl.pop();
        this.helper.dismiss();
        this.helper.toast(`Welcome!`)
      // this.navCtrl.setRoot(TabsPage).then(()=> {
      
      // })
    },err=>{
      this.err = err.message;
      this.helper.dismiss();
    })
  }
  goRegister(){
    this.navCtrl.push('RegisterPage');
  }
}
