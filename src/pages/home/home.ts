  import { CategoryPage } from './../category/category';
import { Component, ViewChild, NgZone } from '@angular/core';
import { NavController, MenuController, Nav, Platform } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AddDealPage } from '../add-deal/add-deal';
import * as moment from 'moment';
import { SimpleDealsPage } from '../simple-deals/simple-deals';
import { User } from '../../datamodel/user';
import { StatusBar } from '@ionic-native/status-bar';
import { HelperProvider } from '../../providers/helper/helper';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { AuthProvider } from '../../providers/auth/auth';
interface Page {
  name: string;
  url: string;
  icon: string;
  isVisible: boolean
}

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
 
  loginPages: Page[] = [
    { name: 'Home', icon: 'home', url: 'home', isVisible: true },
    { name: 'My Favourites', icon: 'star', url: 'FavoritePage', isVisible: true },
    { name: 'Settings', icon: 'settings', url: 'SettingsPage', isVisible: true },
    { name: 'My Profile', icon: 'person', url: 'ProfilePage', isVisible: true },
    { name: 'Logout', icon: 'power', url: 'logout', isVisible: true },

  ]
  logoutPages: Page[] = [
    { name: 'Home', icon: 'home', url: 'home', isVisible: true },
    { name: 'Login', icon: 'log-in', url: 'LoginPage', isVisible: true },
    { name: 'Register', icon: 'person', url: 'RegisterPage', isVisible: true },
  ]

  rootPage: any = SimpleDealsPage;
  @ViewChild(Nav) nav: Nav;
  
  user:User;
  constructor(
    platform: Platform,
    statusBar: StatusBar,
    private helper: HelperProvider,
    splashScreen: SplashScreen,
    androidPermissions: AndroidPermissions,
    private auth: AuthProvider,
    private ngZone: NgZone,
    private menuCtrl: MenuController,private api:ApiProvider){
    }
 
  ionViewDidLoad(){
       
  } 

  getuserProfile():Promise<any>{
    return new Promise((resolve,reject)=>{
      debugger;
      this.api.getProfile(localStorage.getItem('uid')).subscribe((r:User) => {    
        if(r){
          let user:User={
            
            email:r.email || '',
            influencer:r.influencer || false,
            name:r.name || '',
            photo:r.photo || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQx1KyXUF5JPMgtFk8vaAhhOI7_T3zi6JcQw4NB6Sqf5Xr5noXV',
            phone:r.phone || '',
            savedDeals:r.savedDeals|| [],
            uid:localStorage.getItem('uid')      
          }
          resolve(user);
        }else{
          reject(r);
        }
      })
    });    
  }

  navigateTo(url: string) {
    if (url == 'logout') {
      this.auth.logout().then(r=>{
        this.menuCtrl.enable(true,'logoutmenu');
      this.menuCtrl.enable(false,'loginmenu');
      this.rootPage = SimpleDealsPage;
      delete this.user;
      this.helper.toast('logout successfully');
      });
    }
    else if (url == 'home') {
      this.rootPage = SimpleDealsPage;
      
    }else{
      this.nav.setRoot(url);
    }
    this.menuCtrl.close();
  }

  goLogin() {
    this.nav.setRoot('LoginPage');
    
  }

}