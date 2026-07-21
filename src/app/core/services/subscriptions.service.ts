import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface SubscriptionItem {
  sub_uuid: string;
  pla_uuid: string;
  app_uuid: string;
  sub_subscribertype: 'USER' | 'COMPANY';
  usr_uuid?: string;
  cmp_uuid?: string;
  sub_status: 'ACTIVE' | 'PAST_DUE' | 'CANCELLED' | 'TRIAL';
  sub_startsat: string;
  sub_renewsat?: string;
  sub_endsat?: string;
  sub_active?: boolean;
  plan?: any;
  application?: any;
}

@Injectable({
  providedIn: 'root'
})
export class SubscriptionsService {

  constructor(
    private http: HttpClient
  ) { }

  public getSubscriptions(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}subscriptions`);
  }

  public getSubscriptionsBySubscriber(type: 'USER' | 'COMPANY', id: string): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}subscriptions/subscriber/${type}/${id}`);
  }

  public getSubscriptionById(sub_uuid: string): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}subscription/${sub_uuid}`);
  }

  public saveSubscription(subData: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}subscription`, subData);
  }

  public updateSubscription(sub_uuid: string, subData: any): Observable<any> {
    return this.http.put<any>(`${environment.apiUrl}subscription/${sub_uuid}`, subData);
  }

  public deleteSubscription(sub_uuid: string): Observable<any> {
    return this.http.delete<any>(`${environment.apiUrl}subscription/${sub_uuid}`);
  }
}
