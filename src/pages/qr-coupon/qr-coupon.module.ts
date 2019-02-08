import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { QrCouponPage } from './qr-coupon';
import { NgxQRCodeModule } from 'ngx-qrcode2';

@NgModule({
  declarations: [
    QrCouponPage,
  ],
  imports: [
    IonicPageModule.forChild(QrCouponPage),
    NgxQRCodeModule
  ],
})
export class QrCouponPageModule {}
