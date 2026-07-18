import { Injectable, signal, WritableSignal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface UserSession {
  usr_uuid: string;
  usr_email: string;
  usr_name: string;
  usr_surname: string;
  usr_sysadmin: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  // Reactividad moderna de Angular con Signals para almacenar el estado de la sesión
  public currentUser: WritableSignal<UserSession | null> = signal<UserSession | null>(null);

  constructor(private http: HttpClient) {
    this.loadSessionFromStorage();
  }

  public login(credentials: { usr_user: string; usr_password: string }): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}login`, credentials).pipe(
      tap(response => {
        if (response.success && response.data) {
          const user = response.data.user || response.data;
          const token = response.data.token;
          
          if (token) {
            localStorage.setItem('ats_token', token);
          }
          
          const sessionUser: UserSession = {
            usr_uuid: user.usr_uuid,
            usr_email: user.usr_email,
            usr_name: user.usr_name,
            usr_surname: user.usr_surname,
            usr_sysadmin: !!user.usr_sysadmin
          };
          
          localStorage.setItem('ats_user', JSON.stringify(sessionUser));
          this.currentUser.set(sessionUser);
        }
      })
    );
  }

  public register(userData: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}register`, userData);
  }

  public checkNickExist(usr_nick: string): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}user-nick-exist`, { usr_nick });
  }

  public checkEmailExist(usr_email: string): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}user-email-exist`, { usr_email });
  }

  public confirmAccount(token: string): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}confirm-account`, { token });
  }

  public logout(): void {
    localStorage.removeItem('ats_token');
    localStorage.removeItem('ats_user');
    this.currentUser.set(null);
  }

  public isLoggedIn(): boolean {
    return this.currentUser() !== null;
  }

  private loadSessionFromStorage(): void {
    const userStr = localStorage.getItem('ats_user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        this.currentUser.set(user);
      } catch (e) {
        this.logout();
      }
    }
  }
}
