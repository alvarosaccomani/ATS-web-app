import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApplicationUpdatesService {
  constructor(private http: HttpClient) {}

  public getAppUpdates(app_uuid: string): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}application/${app_uuid}/updates`);
  }

  public createAppUpdate(app_uuid: string, updateData: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}application/${app_uuid}/updates`, updateData);
  }
}
