import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApplicationBackupsService {
  constructor(private http: HttpClient) {}

  public getAppBackups(app_uuid: string): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}application/${app_uuid}/backups`);
  }

  public createAppBackup(app_uuid: string, backupData: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}application/${app_uuid}/backups`, backupData);
  }
}
