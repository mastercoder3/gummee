import { Injectable, ErrorHandler } from '@angular/core';
import { ToastController, AlertController, Spinner, LoadingController } from 'ionic-angular';

/*
  Generated class for the HelperProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class HelperProvider {


  loader:any;
  constructor(private toastCtrl:ToastController, private loadingCtrl:LoadingController,
    private alertCtrl:AlertController) {
    console.log('Hello HelperProvider Provider');
  }

  load() {
    this.loader = this.loadingCtrl.create({
      content: ''
    });
    this.loader.present();
  }

  dismiss() {
    if(this.loader){ this.loader.dismiss(); this.loader = null; }
  }

  toast(message){
    return this.toastCtrl.create({
      message:message,
      duration:3000,
      position:'bottomn'
    }).present();
  }



  presentAlert(title, subtitle, buttons) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: subtitle,
      buttons: [
        {
          text:buttons,
          role:'dismiss'
        }
      ]
    });
    alert.present();
  }

  presentConfirm(title, message, successBtn, onsuccess, cancelBtn,oncancel) {
    let alert = this.alertCtrl.create({
      title: title,
      message: message,
      buttons: [
        {
          text: cancelBtn,
          role: 'cancel',
          handler:oncancel
        },
        {
          text: successBtn,
          handler: onsuccess
        }
      ]
    });
    alert.present();
  }

  // presentPrompt(title) {
  //   let alert = this.alertCtrl.create({
  //     title: title,
  //     inputs: [
  //       {
  //         name: 'username',
  //         placeholder: 'Username'
  //       },
  //       {
  //         name: 'password',
  //         placeholder: 'Password',
  //         type: 'password'
  //       }
  //     ],
  //     buttons: [
  //       {
  //         text: 'Cancel',
  //         role: 'cancel',
  //         handler: data => {
  //           console.log('Cancel clicked');
  //         }
  //       },
  //       {
  //         text: 'Login',
  //         handler: data => {
  //           if (User.isValid(data.username, data.password)) {
  //             // logged in!
  //           } else {
  //             // invalid login
  //             return false;
  //           }
  //         }
  //       }
  //     ]
  //   });
  //   alert.present();
  // }

}
