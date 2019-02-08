import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { HelperProvider } from '../../providers/helper/helper';
import { LoginPage } from '../login/login';

/**
 * Generated class for the DeleteaccountPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-deleteaccount',
  templateUrl: 'deleteaccount.html',
})
export class DeleteaccountPage { goBack(){ this.navCtrl.pop(); }
email;
  constructor(public navCtrl: NavController,private auth:AuthProvider,private helper:HelperProvider,
     public navParams: NavParams) {
  }

  user;
  ionViewDidLoad() {
    console.log('ionViewDidLoad DeleteaccountPage');
    this.user = this.navParams.data;
  }


showDeleteAccount(){
  if(this.email === this.user.email){
    this.helper.presentConfirm('Completely Remove Account', 'Are you sure you want to delete your account from the system?', 'DELETE',
    ()=>{
      //delete
      this.deleteAccount();
    },'Cancel',()=>{
      //
      console.log(`cancel`)
    })
  }else{
    this.helper.toast('Incorrect Email')
  }

}

  deleteAccount(){
    this.helper.load();
    this.auth.deleteAccount(this.user.email, this.user.password).then(res=>{
      this.helper.dismiss();
      this.navCtrl.setRoot(LoginPage).then(()=>{
        this.helper.toast('User account Deleted!');
      })
    })
  }

}
