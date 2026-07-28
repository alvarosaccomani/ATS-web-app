import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { CompaniesService, UserCompanyRelationItem } from '../../core/services/companies.service';

@Component({
  selector: 'app-backoffice-suite',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './backoffice-suite.component.html',
  styleUrl: './backoffice-suite.component.scss',
})
export class BackofficeSuiteComponent implements OnInit {
  public userCompanies: UserCompanyRelationItem[] = [];

  constructor(
    public _authService: AuthService,
    public _companiesService: CompaniesService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadUserCompanies();
  }

  public loadUserCompanies(): void {
    const user = this._authService.currentUser();
    if (user?.usr_uuid) {
      this._companiesService.getUserCompanies(user.usr_uuid).subscribe({
        next: (response: any) => {
          if (response.success && Array.isArray(response.data)) {
            this.userCompanies = response.data;
            if (response.data.length > 0 && !this._companiesService.activeCompany()) {
              const firstCompany = response.data[0].company || response.data[0];
              this._companiesService.setActiveCompany(firstCompany);
            }
            this.cdr.detectChanges();
          }
        },
        error: (error: any) => {
          console.error('Error al cargar empresas del usuario:', error);
        }
      });
    }
  }

  public selectCompany(company: any): void {
    this._companiesService.setActiveCompany(company);
    this.cdr.detectChanges();
  }

  public logout(): void {
    this._authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
