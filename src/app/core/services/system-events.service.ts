import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface SystemEventItem {
  sysev_uuid: string;
  usr_uuid: string | null;
  sysev_action: string;
  sysev_entitytype: string;
  sysev_entityuuid: string;
  sysev_details: string | null;
  sysev_ipaddress: string | null;
  sysev_useragent: string | null;
  sysev_createdat: string;
  user?: any;
}

@Injectable({
  providedIn: 'root'
})
export class SystemEventsService {

  constructor(
    private http: HttpClient
  ) { }

  public getSystemEvents(page?: number, perPage?: number): Observable<any> {
    let url = `${environment.apiUrl}system-events`;
    if (page && perPage) {
      url += `?page=${page}&perPage=${perPage}`;
    }
    return this.http.get<any>(url);
  }
}
