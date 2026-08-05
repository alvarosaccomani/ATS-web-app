import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AppResponsiblesService {

  constructor(
    private http: HttpClient
  ) { }
  
  public getResponsibles(app_uuid: string): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}app-responsibles/${app_uuid}`);
  }

  public assignResponsible(app_uuid: string, usr_uuid: string, rol_uuid: string): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}app-responsible/${app_uuid}`, { usr_uuid, rol_uuid });
  }

  public removeResponsible(appres_uuid: string): Observable<any> {
    return this.http.delete<any>(`${environment.apiUrl}app-responsible/${appres_uuid}`);
  }
}
