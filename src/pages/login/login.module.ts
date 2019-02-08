import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LoginPage } from './login';
import { HttpClientModule, HttpClient }    from '@angular/common/http';

@NgModule({
  declarations: [
    LoginPage,
  ],
  imports: [
    IonicPageModule.forChild(LoginPage),
    HttpClientModule
  ],
  providers:[
    HttpClient
  ]
})
export class LoginPageModule {}
