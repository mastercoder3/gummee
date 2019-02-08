import { LoginPage } from './../login/login';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import { AuthProvider } from '../../providers/auth/auth';
import { HelperProvider } from '../../providers/helper/helper';
import { SimpleDealsPage } from '../simple-deals/simple-deals';
import { User } from '../../datamodel/user';

/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  user:User;
  showPhoto:boolean=false;
  constructor(public navCtrl: NavController, private helper: HelperProvider,
    private api: ApiProvider, private auth: AuthProvider,
    public navParams: NavParams) {

      this.api.getProfile(localStorage.getItem('uid')).subscribe((resp:User) => {
        console.log(resp);
        this.user = resp;
        
      })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
    
  }

  goEdit() {
    this.navCtrl.push('UpdateprofilePage', this.user,{animate:true,direction:'forward'});
  }

  go(page: any) {
    if (page == 'FetchdataPage') {
      if(this.user)
      if (this.user.influencer) {
        this.navCtrl.push(page, this.user,{animate:true,direction:'back'});
      }else{
        this.helper.presentAlert('Influencer Required','You must be an influencer ','ok');
      }
    } else {
      this.navCtrl.push(page, this.user,{animate:true,direction:'forward'});
    }
  }


  
  goBack(){
    this.navCtrl.setRoot(SimpleDealsPage,null,{animate:true,direction:'back'});
  }

  showLogout() {
    // items check
    this.helper.presentConfirm('LOGOUT', 'Are you sure you want to logout?', 'LOGOUT', () => {
      //logout

      this.auth.logout();
      this.navCtrl.setRoot(LoginPage);
    }, 'CANCEL', () => {
      //cancel

    })
  }
}
