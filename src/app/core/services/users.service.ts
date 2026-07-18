import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(
    private http: HttpClient
  ) { }

  // Métodos para la gestión privada de perfiles y usuarios (CRUD)
  public getUsers(filter?: string, page?: number, perPage?: number): Observable<any> {
    let url = `${environment.apiUrl}users`;
    if (filter) url += `/${filter}`;
    if (page && perPage) url += `/${page}/${perPage}`;
    return this.http.get<any>(url);
  }

  public getUserById(usr_uuid: string): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}user/${usr_uuid}`);
  }

  public saveUser(userData: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}user`, userData);
  }

  public updateUser(usr_uuid: string, userData: any): Observable<any> {
    return this.http.put<any>(`${environment.apiUrl}user/${usr_uuid}`, userData);
  }

  public deleteUser(usr_uuid: string): Observable<any> {
    return this.http.delete<any>(`${environment.apiUrl}user/${usr_uuid}`);
  }
}
