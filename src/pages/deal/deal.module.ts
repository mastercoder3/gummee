import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DealPage } from './deal';
import {     MomentModule} from 'angular2-moment';

@NgModule({
  declarations: [
    DealPage,
  ],
  imports: [
    MomentModule,
    IonicPageModule.forChild(DealPage),
  ],
})
export class DealPageModule {}
