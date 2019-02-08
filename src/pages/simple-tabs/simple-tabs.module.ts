import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SimpleTabsPage } from './simple-tabs';

@NgModule({
  declarations: [
    SimpleTabsPage,
  ],
  imports: [
    IonicPageModule.forChild(SimpleTabsPage),
  ],
})
export class SimpleTabsPageModule {}
