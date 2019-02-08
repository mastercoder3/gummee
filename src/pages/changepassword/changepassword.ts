import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { ApiProvider } from '../../providers/api/api';
import { HelperProvider } from '../../providers/helper/helper';

/**
 * Generated class for the ChangepasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-changepassword',
  templateUrl: 'changepassword.html',
})
export class ChangepasswordPage { goBack(){ this.navCtrl.pop(); }

  constructor(public navCtrl: NavController,private auth:AuthProvider,private helper:HelperProvider,
    private api:ApiProvider,
     public navParams: NavParams) {
  }
  user;
  newPassword;
  againPassword;
  oldPassword;

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChangepasswordPage');
    this.user = this.navParams.data;
    console.log(this.user);
  }




  ChangePassword(){
    if(this.user.password === this.oldPassword){

      if(this.newPassword === this.againPassword){
        //change password
        this.auth.changePassword(this.user.email, this.oldPassword, this.newPassword).then(res=>{
          this.helper.toast(`Password Updated`)
        })
      }

    }else{
      this.helper.toast(`Incorrect Old passowrd.`)
    }

  }
}
