import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface TransactionItem {
  trn_uuid: string;
  usr_uuid?: string;
  sub_uuid?: string;
  cmp_uuid?: string;
  app_uuid: string;
  trn_provider: string;
  trn_providerid?: string;
  trn_amount: number;
  trn_currency: string;
  trn_platformfee: number;
  trn_netamount: number;
  trn_status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'REFUNDED';
  trn_paymentmethod?: string;
  trn_description?: string;
  trn_metadata?: string;
  trn_createdat: string;
  user?: any;
  company?: any;
  application?: any;
}

@Injectable({
  providedIn: 'root'
})
export class TransactionsService {

  constructor(
    private http: HttpClient
  ) { }

  public getTransactions(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}transactions`);
  }

  public getTransactionsBySubscriber(type: 'USER' | 'COMPANY', id: string): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}transactions/subscriber/${type}/${id}`);
  }

  public getTransactionById(trn_uuid: string): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}transaction/${trn_uuid}`);
  }

  public saveTransaction(trnData: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}transaction`, trnData);
  }
}
