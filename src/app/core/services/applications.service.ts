import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ApplicationItem {
  app_uuid: string;
  app_cod: string;
  app_name: string;
  tapp_uuid: string;
  app_description: string;
  app_dbname: string;
  app_url: string;
  app_hasaccess: boolean;
  app_active: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ApplicationsService {

  constructor(
    private http: HttpClient
  ) { }

  public getApplications(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}applications`);
  }

  public getApplicationById(app_uuid: string): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}application/${app_uuid}`);
  }

  public saveApplication(appData: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}application`, appData);
  }

  public updateApplication(app_uuid: string, appData: any): Observable<any> {
    return this.http.put<any>(`${environment.apiUrl}application/${app_uuid}`, appData);
  }

  public deleteApplication(app_uuid: string): Observable<any> {
    return this.http.delete<any>(`${environment.apiUrl}application/${app_uuid}`);
  }
}
