import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApplicationMaintenancesService {
  constructor(private http: HttpClient) {}

  public getAppMaintenances(app_uuid: string): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}application/${app_uuid}/maintenances`);
  }

  public createAppMaintenance(app_uuid: string, maintData: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}application/${app_uuid}/maintenances`, maintData);
  }
}
