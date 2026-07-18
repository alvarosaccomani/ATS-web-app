import { Injectable, signal, WritableSignal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { getCookie, setCookie, deleteCookie, getSharedDomain } from '../utils/cookie-utils';

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
          const domain = getSharedDomain();
          
          if (token) {
            // Guardamos el token en una cookie por 7 días con el dominio compartido
            setCookie('ats_token', token, 7, domain);
          }
          
          const sessionUser: UserSession = {
            usr_uuid: user.usr_uuid,
            usr_email: user.usr_email,
            usr_name: user.usr_name,
            usr_surname: user.usr_surname,
            usr_sysadmin: !!user.usr_sysadmin
          };
          
          // Guardamos el perfil en formato JSON codificado en una cookie por 7 días
          setCookie('ats_user', encodeURIComponent(JSON.stringify(sessionUser)), 7, domain);
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

  public forgotPassword(usr_email: string): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}forgot-password`, { usr_email });
  }

  public resetPassword(token: string, newPassword: string): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}reset-password`, { token, newPassword });
  }

  public logout(): void {
    const domain = getSharedDomain();
    deleteCookie('ats_token', domain);
    deleteCookie('ats_user', domain);
    this.currentUser.set(null);
  }

  public isLoggedIn(): boolean {
    return this.currentUser() !== null;
  }

  private loadSessionFromStorage(): void {
    const userCookie = getCookie('ats_user');
    if (userCookie) {
      try {
        const user = JSON.parse(decodeURIComponent(userCookie));
        this.currentUser.set(user);
      } catch (e) {
        this.logout();
      }
    }
  }
}
