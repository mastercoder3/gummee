import { LoginPage } from './../pages/login/login';
import { Component, ViewChild, NgZone, SimpleChanges } from '@angular/core';
import { Platform, Nav, MenuController, NavParams, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { AndroidPermissions } from '@ionic-native/android-permissions';
import { SimpleDealsPage } from '../pages/simple-deals/simple-deals';
import { FavoritePage } from '../pages/favorite/favorite';
import { SettingsPage } from '../pages/settings/settings';
import { ProfilePage } from '../pages/profile/profile';
import { HelperProvider } from '../providers/helper/helper';
import { HomePage } from '../pages/home/home';
import { CategoryPage } from '../pages/category/category';
import { ApiProvider } from '../providers/api/api';
import { AuthProvider } from '../providers/auth/auth';
import { analyzeAndValidateNgModules } from '@angular/compiler';
import { User } from '../datamodel/user';
import { FCM } from '@ionic-native/fcm';


interface Page {
  name: string;
  url: string;
  icon: string;
  isVisible: boolean
}
@Component({
  templateUrl: 'app.html'
})
export class MyApp {

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
  
  user:User={
  
    email:'',
    influencer:false,
    name:'',
    phone:'',
    photo:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQx1KyXUF5JPMgtFk8vaAhhOI7_T3zi6JcQw4NB6Sqf5Xr5noXV',
    savedDeals:[],
    uid:''
  }

  constructor(
    platform: Platform,
    private fcm:FCM,
    statusBar: StatusBar,
    private helper: HelperProvider,
    splashScreen: SplashScreen,
    androidPermissions: AndroidPermissions,
    private auth: AuthProvider,
    private events:Events,  
    private menuCtrl: MenuController,private api:ApiProvider) {
  
    
    platform.ready().then(() => {
      console.log('app.component loaded');
      
      androidPermissions.checkPermission(androidPermissions.PERMISSION.CAMERA).then(
        result => console.log('Has permission?', result.hasPermission),
        err => androidPermissions.requestPermission(androidPermissions.PERMISSION.CAMERA)).catch(err => console.log(`android permission error`))
        androidPermissions.requestPermissions([androidPermissions.PERMISSION.CAMERA, androidPermissions.PERMISSION.GET_ACCOUNTS])
        .catch(err => console.log(`Cordova error!`));
        

        this.auth.isAuthenticated().subscribe(r => {
          if (r) {     
          this.setLoggedInView();        
          }else{
            this.setLoggedOutView();
          }    
        })

      statusBar.styleDefault();
      splashScreen.hide();
      this.rootPage = SimpleDealsPage;
    });

    this.events.subscribe('user:loggedIn',(data)=>{
      
      console.log('login event recieved'+ data);
      this.setLoggedInView();
    })
  
    
  }



  setLoggedInView(){
    
    this.getuserProfile().then((data)=>{
      this.user=data;
      this.menuCtrl.enable(true,'loginmenu');
      this.menuCtrl.enable(false,'logoutmenu');
      
      // this.fcm.getToken().then(token => {
      // this.user.token=token;
      // this.api.updateProfile(this.user.uid,this.user).then(r=>{
      //   console.log('token update with user device id');
      // })
      // });

      // this.fcm.onNotification().subscribe(data => {
      //   if(data.wasTapped){
      //     console.log("Received in background");
      //     //code to open the ui and display the recieved deal
      //     this.navigateTo('FetchdataPage');
      //   } else {
      //     console.log("Received in foreground");
      //   };
      // });
      
      // this.fcm.onTokenRefresh().subscribe(token => {
      //   this.user.token=token;
      //   this.api.updateProfile(this.user.uid,this.user).then(r=>{
      //   console.log('token update with user device id');
      // })
      // });
    });
  }


  setLoggedOutView(){
    this.menuCtrl.enable(true,'logoutmenu');
    this.user={
      
email:'',
influencer:false,
name:'',
phone:'',
photo:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQx1KyXUF5JPMgtFk8vaAhhOI7_T3zi6JcQw4NB6Sqf5Xr5noXV',
savedDeals:[],
uid:''
    }
  this.menuCtrl.enable(false,'loginmenu');
  this.rootPage = SimpleDealsPage;
  
  }

  

  getuserProfile():Promise<any>{
    return new Promise((resolve,reject)=>{
      
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
        this.setLoggedOutView();
      });
    }
    else if (url == 'home') {
      this.rootPage = SimpleDealsPage;
      
    }else{
      this.nav.setRoot(url,null,{
        animate:true,
        direction:'forward'
      });
    }
    this.menuCtrl.close();
  }

  goLogin() {
    this.nav.setRoot('LoginPage');
    
  }


  getNewInvites(){
    this.api.getUserDeals(this.user.uid).subscribe(r=>{
      console.log('all new deals recieved' + r);
      
    })
  }
}
