import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import {WorkViewer} from "../components/work-viewer";
import {StreamingMedia} from "@ionic-native/streaming-media";
import {FCM} from "@ionic-native/fcm";
import { ServerRest } from "../core/services/server-rest";
// import { HttpClientModule } from "@angular/common/http";
import { IonicStorageModule } from '@ionic/storage';
import { HTTP } from '@ionic-native/http';
import { StatusBar } from '@ionic-native/status-bar';
import { Network } from '@ionic-native/network';
import { Badge } from '@ionic-native/badge';


@NgModule({
  declarations: [
    MyApp,
    HomePage,
    WorkViewer
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    StreamingMedia,
    FCM,
    ServerRest,
    HTTP,
    StatusBar,
    Network,
    Badge,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
