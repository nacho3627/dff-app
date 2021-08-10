import {Injectable} from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable()
export class StorageService {
  constructor(private storage: Storage) {

  }

  ngOnInit() {

  }

  public getInitialCount() : Promise<number> {
    return this.storage.get("initialGetCount").then(val => {
      console.log(val);
      return val;
    })
    .catch(err => {
      console.log(err);
      return err;
    });
  }

  public setInitialCount(value : number) : void {
    this.storage.set("initialGetCount", value);
    console.log('saved' + value);
  }

}
