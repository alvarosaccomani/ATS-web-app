import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface UserAuthLogItem {
  usraulo_uuid: string;
  usr_uuid: string;
  app_uuid: string;
  usraulo_action: 'LOGIN_SUCCESS' | 'LOGIN_FAILED' | 'LOGOUT' | 'TOKEN_REFRESH';
  usraulo_ipaddress?: string;
  usraulo_useragent?: string;
  usraulo_failurereason?: string;
  usraulo_createdat: string;
  user?: any;
  application?: any;
}

@Injectable({
  providedIn: 'root'
})
export class UserAuthLogsService {

  constructor(
    private http: HttpClient
  ) { }

  public getUserAuthLogs(page?: number, perPage?: number): Observable<any> {
    let url = `${environment.apiUrl}user-auth-logs`;
    if (page && perPage) {
      url += `?page=${page}&perPage=${perPage}`;
    }
    return this.http.get<any>(url);
  }

  public getUserAuthLogsByUserId(usr_uuid: string): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}user-auth-logs/user/${usr_uuid}`);
  }

  public getDetailUserAuthLog(usraulo_uuid: string): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}user-auth-log/${usraulo_uuid}`);
  }
}
