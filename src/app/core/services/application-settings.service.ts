import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ApplicationSettingInterface {
  app_uuid: string;
  apps_uuid: string;
  apps_key: string;
  apps_parameter: string;
  apps_description: string;
  apps_value: string;
  apps_datatype: string;
  apps_options: string;
  apps_group: string;
  apps_createdat: Date;
  apps_updatedat: Date;
}

@Injectable({
  providedIn: 'root'
})
export class ApplicationSettingsService {
  constructor(private http: HttpClient) {}

  public getApplicationsSettings(app_uuid: string): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}application/${app_uuid}/settings`);
  }

  public saveApplicationSetting(payload: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}application/${payload.app_uuid}/settings`, payload);
  }

  public updateApplicationSetting(payload: any): Observable<any> {
    return this.http.put<any>(`${environment.apiUrl}application/${payload.app_uuid}/settings/${payload.apps_uuid}`, payload);
  }
}
