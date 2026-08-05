import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TicketsService {

  constructor(private http: HttpClient) { }

  public getTickets(filters?: { status?: string; type?: string; app_uuid?: string; page?: number; perPage?: number }): Observable<any> {
    let params = new HttpParams();
    if (filters) {
      if (filters.status) params = params.set('status', filters.status);
      if (filters.type) params = params.set('type', filters.type);
      if (filters.app_uuid) params = params.set('app_uuid', filters.app_uuid);
      if (filters.page) params = params.set('page', filters.page.toString());
      if (filters.perPage) params = params.set('perPage', filters.perPage.toString());
    }
    return this.http.get<any>(`${environment.apiUrl}tickets`, { params });
  }

  public getMyTickets(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}tickets/my-tickets`);
  }

  public getTicketById(tic_uuid: string): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}ticket/${tic_uuid}`);
  }

  public saveTicket(ticketData: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}ticket`, ticketData);
  }

  public updateTicket(tic_uuid: string, ticketData: any): Observable<any> {
    return this.http.put<any>(`${environment.apiUrl}ticket/${tic_uuid}`, ticketData);
  }

  public deleteTicket(tic_uuid: string): Observable<any> {
    return this.http.delete<any>(`${environment.apiUrl}ticket/${tic_uuid}`);
  }
}
