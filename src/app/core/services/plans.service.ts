import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface PlanItem {
  pla_uuid: string;
  app_uuid: string;
  pla_cod: string;
  pla_name: string;
  pla_description?: string;
  pla_price: number;
  pla_currency: string;
  pla_billingcycle: string;
  pla_pricingtype: string;
  pla_platformfeepercent?: number;
  pla_active?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class PlansService {

  constructor(
    private http: HttpClient
  ) { }

  public getPlans(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}plans`);
  }

  public getPlanById(pla_uuid: string): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}plan/${pla_uuid}`);
  }

  public savePlan(plaData: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}plan`, plaData);
  }

  public updatePlan(pla_uuid: string, plaData: any): Observable<any> {
    return this.http.put<any>(`${environment.apiUrl}plan/${pla_uuid}`, plaData);
  }

  public deletePlan(pla_uuid: string): Observable<any> {
    return this.http.delete<any>(`${environment.apiUrl}plan/${pla_uuid}`);
  }
}
