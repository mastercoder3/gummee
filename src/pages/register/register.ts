import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { ApiProvider } from '../../providers/api/api';
import { HelperProvider } from '../../providers/helper/helper';
import { LoginPage } from '../login/login';
import { MyApp } from '../../app/app.component';
import { SimpleDealsPage } from '../simple-deals/simple-deals';
import { User } from '../../datamodel/user';
import { RegisterinfluencerPage } from '../registerinfluencer/registerinfluencer';

/**
 * Generated class for the RegisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage{

  constructor(private events:Events,public navCtrl: NavController, private auth:AuthProvider,private api:ApiProvider,private helper:HelperProvider,
    public navParams: NavParams) {
  }

  user={
    email:'',
    phone:'',
    name:'',
    savedDeals:[],
    influencer:false,
    photo:'',
    uid:'',
    password:'',
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }


two(){
  this.navCtrl.push(RegisterinfluencerPage, {
  user:this.user
  });
}

  err;
  register(){
    this.helper.load();

    this.auth.signup(this.user).then((resp:any)=>{
      this.api.createProfile(resp.user.uid, this.user).then(r=>{
        this.api.updateUid(resp.user.uid).then(r=>{
          console.log('user id updated in profile')
        },err=>{
          console.log(err);
        });
        this.helper.dismiss();
        this.events.publish('user:loggedIn',resp.user);
          this.helper.toast(`Welcome!`)
          this.navCtrl.setRoot(RegisterinfluencerPage);
      },err=>{
        debugger;
        console.log(err);
        this.helper.dismiss();
        this.helper.toast(err);
        this.navCtrl.parent(MyApp);
        
      })

    },err=>{
      debugger
      this.err = err.message;
      this.helper.presentAlert('signup error',this.err,'ok');
      this.helper.dismiss();
    })
  }
  goLogin(){
    this.navCtrl.push(LoginPage);
  }
  registerinf(){
  this.navCtrl.push(RegisterinfluencerPage)
  }

  goback(){
  this.navCtrl.setRoot(SimpleDealsPage)
  }
}
