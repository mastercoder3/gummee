import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FetchdataPage } from './fetchdata';

@NgModule({
  declarations: [
    FetchdataPage,
  ],
  imports: [
    IonicPageModule.forChild(FetchdataPage),
  ],
})
export class FetchdataPageModule {}
