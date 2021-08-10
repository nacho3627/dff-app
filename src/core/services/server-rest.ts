import {Injectable} from '@angular/core';
import {Environment} from "../../environments/environment";
import { HTTP } from '@ionic-native/http';


@Injectable()
export class ServerRest {
  constructor(private http: HTTP) {

  }

  getCount(): Promise<GetCountResponse> {
    return this.http.get(Environment.serverHost + "/images/works/get_count", {}, {}).then((data) => {
      return JSON.parse(data.data);
    });
  }

  getIpInfo(): Promise<IpInfo> {
    return this.http.get(Environment.serverHost + "http://ip-api.com/json/", {}, {}).then((data) => {
      return JSON.parse(data.data);
    });
  }
}

export class GetCountResponse {
  count: number;

}

export class IpInfo {
  status: string;
  country: string;
  countryCode: string;
  region: string;
  regionName: string;
  city: string;
  zip: string;
  lat: string;
  lon: string;
  timezone: string;
  isp: string;
  org: string;
  as: string;
  query: string;
}
