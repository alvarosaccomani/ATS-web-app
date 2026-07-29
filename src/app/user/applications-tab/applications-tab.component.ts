import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ApplicationsService } from '../../core/services/applications.service';
import { TypeApplicationsService } from '../../core/services/type-applications.service';

@Component({
  selector: 'app-applications-tab',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './applications-tab.component.html',
  styleUrl: './applications-tab.component.scss',
})
export class ApplicationsTabComponent implements OnInit {
  // ABM de Aplicaciones
  public applicationsList: any[] = [];
  public loadingApplicationsList = false;
  public appsViewMode: 'list' | 'edit' | 'create' = 'list';
  public selectedApp: any | null = null;
  public appForm!: FormGroup;
  public typeApplicationsList: any[] = [];
  public loadingTypeApps = false;

  public loadingSave = false;
  public submitted = false;
  public errorMessage = '';
  public successMessage = '';

  constructor(
    public _authService: AuthService,
    private _applicationsService: ApplicationsService,
    private _typeApplicationsService: TypeApplicationsService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadAppsCatalog();
    this.loadTypeApplications();
  }

  private initForm(): void {
    this.appForm = this.fb.group({
      app_cod: ['', [Validators.required]],
      app_name: ['', [Validators.required]],
      tapp_uuid: ['', [Validators.required]],
      app_description: ['', [Validators.required]],
      app_dbname: ['', [Validators.required]],
      app_url: ['', [Validators.required]],
      app_hasaccess: [true],
      app_active: [true]
    });
  }

  public loadAppsCatalog(): void {
    this.loadingApplicationsList = true;
    this._applicationsService.getApplications().subscribe({
      next: (response: any) => {
        this.loadingApplicationsList = false;
        this.applicationsList = response.data || [];
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        this.loadingApplicationsList = false;
        this.cdr.detectChanges();
      }
    });
  }

  public loadTypeApplications(): void {
    this.loadingTypeApps = true;
    this._typeApplicationsService.getTypeApplications().subscribe({
      next: (response: any) => {
        this.loadingTypeApps = false;
        this.typeApplicationsList = response.data || [];
        this.cdr.detectChanges();
      },
      error: () => {
        this.loadingTypeApps = false;
        this.cdr.detectChanges();
      }
    });
  }

  public enterCreateAppMode(): void {
    this.selectedApp = null;
    this.appsViewMode = 'create';
    this.submitted = false;
    this.errorMessage = '';
    this.successMessage = '';
    this.appForm.reset({
      app_hasaccess: true,
      app_active: true
    });
    this.cdr.detectChanges();
  }

  public enterEditAppMode(app: any): void {
    this.selectedApp = app;
    this.appsViewMode = 'edit';
    this.submitted = false;
    this.errorMessage = '';
    this.successMessage = '';
    this.appForm.patchValue({
      app_cod: app.app_cod,
      app_name: app.app_name,
      tapp_uuid: app.tapp_uuid || '',
      app_description: app.app_description,
      app_dbname: app.app_dbname,
      app_url: app.app_url,
      app_hasaccess: !!app.app_hasaccess,
      app_active: !!app.app_active
    });
    this.cdr.detectChanges();
  }

  public exitAppMode(): void {
    this.selectedApp = null;
    this.appsViewMode = 'list';
    this.appForm.reset();
    this.cdr.detectChanges();
  }

  public saveApplication(): void {
    this.submitted = true;
    this.errorMessage = '';
    this.successMessage = '';

    if (this.appForm.invalid) {
      return;
    }

    this.loadingSave = true;
    this.cdr.detectChanges();
    if (this.appsViewMode === 'create') {
      this._applicationsService.saveApplication(this.appForm.value).subscribe({
        next: () => {
          this.loadingSave = false;
          this.successMessage = 'Aplicación creada con éxito.';
          this.loadAppsCatalog();
          this.cdr.detectChanges();
          setTimeout(() => this.exitAppMode(), 1500);
        },
        error: (err: any) => {
          this.loadingSave = false;
          this.errorMessage = err.error?.error || err.error?.message || 'Error al crear la aplicación.';
          this.cdr.detectChanges();
        }
      });
    } else if (this.appsViewMode === 'edit' && this.selectedApp) {
      this._applicationsService.updateApplication(this.selectedApp.app_uuid, this.appForm.value).subscribe({
        next: () => {
          this.loadingSave = false;
          this.successMessage = 'Aplicación actualizada con éxito.';
          this.loadAppsCatalog();
          this.cdr.detectChanges();
          setTimeout(() => this.exitAppMode(), 1500);
        },
        error: (err: any) => {
          this.loadingSave = false;
          this.errorMessage = err.error?.error || err.error?.message || 'Error al actualizar la aplicación.';
          this.cdr.detectChanges();
        }
      });
    }
  }

  public deleteApplication(app_uuid: string): void {
    if (confirm('¿Estás seguro de que deseas eliminar esta aplicación del catálogo?')) {
      this._applicationsService.deleteApplication(app_uuid).subscribe({
        next: () => {
          this.loadAppsCatalog();
          this.cdr.detectChanges();
        },
        error: () => {
          this.errorMessage = 'No se pudo eliminar la aplicación seleccionada.';
          this.cdr.detectChanges();
        }
      });
    }
  }
}
