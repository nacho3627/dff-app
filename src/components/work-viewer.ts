import {ChangeDetectionStrategy, ChangeDetectorRef, Component, NgZone} from '@angular/core';
import {StreamingMedia, StreamingVideoOptions} from "@ionic-native/streaming-media";
import {ServerRest} from "../core/services/server-rest";
import {Environment} from "../environments/environment";
import {FCM} from "@ionic-native/fcm";
import {Storage} from '@ionic/storage';
import {StatusBar} from '@ionic-native/status-bar';
import {Network} from '@ionic-native/network';
import {Platform} from "ionic-angular";
import {Badge} from "@ionic-native/badge"


enum LoadStep {
  LOADING_SPLASH_SCREEN = 0,
  SHOWING_SPLASH_SCREEN = 1,
  LOADED = 2
}

@Component({
  selector: 'work-viewer',
  templateUrl: 'work-viewer.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WorkViewer {

  public connectionAvailable: boolean = true;

  public splashScreenSrc = null;

  public currentWorkURL: string = null;
  private imageCount: number = null;
  public activeBars: boolean = false;
  private activeBarsTimeoutId;

  public countryCode: string = null;

  public LoadStep = LoadStep; // Enum import
  private loadStep: LoadStep = LoadStep.LOADING_SPLASH_SCREEN;

  public initialCount: number = null;

  // Booleano que indica si es Free o Premium
  public PremiumApp: boolean = Environment.premiumApp;


  constructor(private ref: ChangeDetectorRef, private rest: ServerRest, private streamingMedia: StreamingMedia, private storage: Storage, private fcm: FCM, private statusBar: StatusBar, private network: Network, private platform: Platform, private badge: Badge, private ngZone: NgZone) {


    this.platform.ready().then(() => {
      this.fcm.subscribeToTopic("new-image");

      this.fcm.onNotification().subscribe(data => {
          if (data.wasTapped) {
            this.refreshWorkImage();
          } else {
            this.refreshWorkImage();
          }
        },
        error => {
          alert(error);
        }
      );
      this.oldInit();

      // When state goes foreground
      this.platform.resume.subscribe((result) => {
        this.refreshWorkImage();

      });

    }).catch((error) => {

    });

  }


  oldInit() {
    //Ocultamos status bar
    this.statusBar.hide();

    this.connectionAvailable = !(this.network.type === 'none');

    //Escuchar cambios en la conexión
    this.network.onchange().subscribe(() => {
      setTimeout(() => {
        this.ngZone.run(() => {
          if (this.network.type === 'none') {
            this.connectionAvailable = false;
            this.ref.markForCheck();
          } else {
            this.connectionAvailable = true;
            this.loadStep = LoadStep.LOADED;
            this.refreshWorkImage();
            this.ref.markForCheck();
          }
        });
      }, 3000)
    });


    //Obtenemos el pais a traves de la IP
    this.rest.getIpInfo().then(
      result => {
        this.splashScreenSrc = Environment.serverHost + "/images/splash/" + result.countryCode.toLowerCase();
        this.ref.markForCheck();
      },
      error => {
        this.countryCode = "";
      }
    );

    this.splashScreenSrc = Environment.serverHost + "/images/splash/default";
    this.ref.markForCheck();

    //Descomentar y correr la app para borrar el storage
    //this.storage.set("initialGetCount", null);

    this.refreshWorkImage();


  }  // end ngOnInit

  public activateBars() {
    if (this.loadStep != LoadStep.LOADED) return

    if (this.activeBarsTimeoutId != null) {
      clearTimeout(this.activeBarsTimeoutId);
    }

    this.activeBars = !this.activeBars;

    this.activeBarsTimeoutId = setTimeout(function () {
      this.activeBars = false;
      this.ref.markForCheck();
    }.bind(this), 5000);
  }

  public splashScreenLoaded() {
    this.loadStep = LoadStep.SHOWING_SPLASH_SCREEN;
    this.activeBarsTimeoutId = setTimeout(function () {
      this.loadStep = LoadStep.LOADED;
      this.ref.markForCheck();
    }.bind(this), 5000);
  }

  public getImageURLFromIndex(index: number): string {
    if (index == null) return null;
    return Environment.serverHost + "/images/works/" + (((((index + 1) * 256512) / 12) + 2222).toString());
  }


  public videoButtonClicked() {
    console.log("button clicked");
    let options: StreamingVideoOptions = {
      successCallback: () => {
        console.log('Video played')
      },
      errorCallback: (e) => {
        console.log('Error streaming')
      },
      orientation: 'portrait',
      shouldAutoClose: true,
      controls: false
    };
    this.streamingMedia.playVideo(Environment.serverHost + '/video', options);

  }

  private refreshWorkImage() {
    // Clear badge
    this.badge.get().then(badge=>{
      console.log(badge);
      if(badge > 0) {
        this.badge.clear().then(response=>{
          console.log('Badge cleared');
        });
      }
    });

    this.rest.getCount().then(
      result => {
        this.imageCount = result.count;

        if (this.PremiumApp) {
          // Si es premium uso el último index que me devuelve el get_count
          this.currentWorkURL = this.getImageURLFromIndex(this.imageCount - 1);
        } else {
          // Si es free
          this.storage.get("initialGetCount").then(val => {
            console.log(`Getting work count ${val} from database.`);
            this.initialCount = val;
            if (this.initialCount == null) {
              // Si el count almacenado es null (caso si es primera vez que se inicia la app) guardo el get_count y uso index 0
              this.storage.set("initialGetCount", this.imageCount);
              this.currentWorkURL = this.getImageURLFromIndex(0);
              console.log(`Work count ${this.imageCount} saved successfully.`);
            } else {
              // Si existe count almacenado calculo el index que debo mostrar
              this.currentWorkURL = this.getImageURLFromIndex(this.imageCount - this.initialCount);
            }
          })
            .catch(err => {
              console.log(err);
              return err;
            });

        }

      }, error => {
        //TODO: Hacer algo en el error; Ver que pasa si el usuario no tiene internet
        this.currentWorkURL = this.getImageURLFromIndex(0);
      }
    )
  }


}
