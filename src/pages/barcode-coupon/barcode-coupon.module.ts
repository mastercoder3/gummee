import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BarcodeCouponPage } from './barcode-coupon';
import { NgxBarcodeModule } from 'ngx-barcode';

@NgModule({
  declarations: [
    BarcodeCouponPage,
  ],
  imports: [
    NgxBarcodeModule,
    IonicPageModule.forChild(BarcodeCouponPage),
  ],
})
export class BarcodeCouponPageModule {}
