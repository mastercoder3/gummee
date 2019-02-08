import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddDealPage } from './add-deal';

@NgModule({
  declarations: [
    AddDealPage,
  ],
  imports: [
    IonicPageModule.forChild(AddDealPage),
  ],
})
export class AddDealPageModule {}
