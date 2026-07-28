import { Component, OnInit, ChangeDetectorRef, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { CompaniesService } from '../../core/services/companies.service';
import { SubscriptionsService, SubscriptionItem } from '../../core/services/subscriptions.service';
import { TransactionsService, TransactionItem } from '../../core/services/transactions.service';

@Component({
  selector: 'app-subscriptions-tab',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './subscriptions-tab.component.html',
  styleUrl: './subscriptions-tab.component.scss',
})
export class SubscriptionsTabComponent implements OnInit {
  public activeSubscriptions: SubscriptionItem[] = [];
  public loadingSubscriptions = false;
  public userTransactions: TransactionItem[] = [];
  public loadingTransactions = false;

  constructor(
    public _authService: AuthService,
    public _companiesService: CompaniesService,
    private _subscriptionsService: SubscriptionsService,
    private _transactionsService: TransactionsService,
    private cdr: ChangeDetectorRef
  ) {
    // Escuchar cambios reactivos en la empresa activa usando Angular Signals
    effect(() => {
      const activeCmp = this._companiesService.activeCompany();
      this.loadSubscriptions();
      this.loadTransactions();
    });
  }

  ngOnInit(): void {
    this.loadSubscriptions();
    this.loadTransactions();
  }

  public loadSubscriptions(): void {
    this.loadingSubscriptions = true;
    this.cdr.detectChanges();
    const activeCmp = this._companiesService.activeCompany();
    const user = this._authService.currentUser();

    if (activeCmp?.cmp_uuid) {
      this._subscriptionsService.getSubscriptionsBySubscriber('COMPANY', activeCmp.cmp_uuid).subscribe({
        next: (response: any) => {
          this.loadingSubscriptions = false;
          this.activeSubscriptions = response.data || [];
          this.cdr.detectChanges();
        },
        error: () => {
          this.loadingSubscriptions = false;
          this.cdr.detectChanges();
        }
      });
    } else if (user?.usr_uuid) {
      this._subscriptionsService.getSubscriptionsBySubscriber('USER', user.usr_uuid).subscribe({
        next: (response: any) => {
          this.loadingSubscriptions = false;
          this.activeSubscriptions = response.data || [];
          this.cdr.detectChanges();
        },
        error: () => {
          this.loadingSubscriptions = false;
          this.cdr.detectChanges();
        }
      });
    } else {
      this.loadingSubscriptions = false;
      this.cdr.detectChanges();
    }
  }

  public loadTransactions(): void {
    this.loadingTransactions = true;
    this.cdr.detectChanges();
    const activeCmp = this._companiesService.activeCompany();
    const user = this._authService.currentUser();

    if (activeCmp?.cmp_uuid) {
      this._transactionsService.getTransactionsBySubscriber('COMPANY', activeCmp.cmp_uuid).subscribe({
        next: (response: any) => {
          this.loadingTransactions = false;
          this.userTransactions = response.data || [];
          this.cdr.detectChanges();
        },
        error: () => {
          this.loadingTransactions = false;
          this.cdr.detectChanges();
        }
      });
    } else if (user?.usr_uuid) {
      this._transactionsService.getTransactionsBySubscriber('USER', user.usr_uuid).subscribe({
        next: (response: any) => {
          this.loadingTransactions = false;
          this.userTransactions = response.data || [];
          this.cdr.detectChanges();
        },
        error: () => {
          this.loadingTransactions = false;
          this.cdr.detectChanges();
        }
      });
    } else {
      this.loadingTransactions = false;
      this.cdr.detectChanges();
    }
  }
}
