import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface TypeApplicationItem {
  tapp_uuid: string;
  tapp_cod: string;
  tapp_name: string;
  tapp_description: string;
  tapp_bkcolor: string;
  tapp_frcolor: string;
  tapp_active: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class TypeApplicationsService {

  constructor(
    private http: HttpClient
  ) { }

  public getTypeApplications(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}type-applications`);
  }

  public getTypeApplicationById(tapp_uuid: string): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}type-application/${tapp_uuid}`);
  }

  public saveTypeApplication(typeAppData: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}type-application`, typeAppData);
  }

  public updateTypeApplication(tapp_uuid: string, typeAppData: any): Observable<any> {
    return this.http.put<any>(`${environment.apiUrl}type-application/${tapp_uuid}`, typeAppData);
  }

  public deleteTypeApplication(tapp_uuid: string): Observable<any> {
    return this.http.delete<any>(`${environment.apiUrl}type-application/${tapp_uuid}`);
  }
}
