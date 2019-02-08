import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { ApiProvider } from '../../providers/api/api';
import { HelperProvider } from '../../providers/helper/helper';
import { LoginPage } from '../login/login';
import { MyApp } from '../../app/app.component';
import { SimpleDealsPage } from '../simple-deals/simple-deals';
import { User } from '../../datamodel/user';
import { RegisterPage } from '../register/register';

/**
 * Generated class for the RegisterinfluencerPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-registerinfluencer',
  templateUrl: 'registerinfluencer.html',
})
export class RegisterinfluencerPage {

 constructor(private events:Events,public navCtrl: NavController, private auth:AuthProvider,private api:ApiProvider,private helper:HelperProvider,
    public navParams: NavParams) {

    this.user = navParams.get('user');
  }

  user={
    email:'',
    phone:'',
    name:'',
    birthday:'',
    savedDeals:[],
    influencer:false,
    photo:'',
    username:'',
    uid:'',
    password:'',
  }

  ionViewDidLoad() {
    console.log('this.user');
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
          this.navCtrl.setRoot(SimpleDealsPage);
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
    goback(){
  this.navCtrl.setRoot(RegisterPage)
  }

  skip(){
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
          this.navCtrl.setRoot(SimpleDealsPage);
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
}
