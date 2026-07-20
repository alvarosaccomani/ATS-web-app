import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface CompanyItem {
  cmp_uuid: string;
  cmp_cod: string;
  cmp_name: string;
  cmp_cuit?: string;
  cmp_address?: string;
  cmp_phone?: string;
  cmp_email?: string;
  cmp_description?: string;
  cmp_image?: string;
  cmp_active?: boolean;
}

export interface UserCompanyRelationItem {
  usrcmp_uuid: string;
  usr_uuid: string;
  cmp_uuid: string;
  usrcmp_role: string;
  usrcmp_active: boolean;
  company?: CompanyItem;
}

@Injectable({
  providedIn: 'root'
})
export class CompaniesService {

  // Signal para la empresa activa seleccionada (Tenant Activo)
  public activeCompany = signal<CompanyItem | null>(null);

  constructor(
    private http: HttpClient
  ) {
    this.initActiveCompany();
  }

  private initActiveCompany(): void {
    const saved = localStorage.getItem('ats_active_company');
    if (saved) {
      try {
        this.activeCompany.set(JSON.parse(saved));
      } catch {
        this.activeCompany.set(null);
      }
    }
  }

  public setActiveCompany(company: CompanyItem | null): void {
    this.activeCompany.set(company);
    if (company) {
      localStorage.setItem('ats_active_company', JSON.stringify(company));
    } else {
      localStorage.removeItem('ats_active_company');
    }
  }

  public getCompanies(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}companies`);
  }

  public getUserCompanies(usr_uuid: string): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}user-companies/user/${usr_uuid}`);
  }

  public getCompanyById(cmp_uuid: string): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}company/${cmp_uuid}`);
  }

  public saveCompany(cmpData: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}company`, cmpData);
  }

  public updateCompany(cmp_uuid: string, cmpData: any): Observable<any> {
    return this.http.put<any>(`${environment.apiUrl}company/${cmp_uuid}`, cmpData);
  }

  public deleteCompany(cmp_uuid: string): Observable<any> {
    return this.http.delete<any>(`${environment.apiUrl}company/${cmp_uuid}`);
  }
}
