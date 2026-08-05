import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ApplicationsService } from '../../core/services/applications.service';
import { TypeApplicationsService } from '../../core/services/type-applications.service';
import { RolesService } from '../../core/services/roles.service';
import { AppResponsiblesService } from '../../core/services/app-responsibles.service';
import { UsersService } from '../../core/services/users.service';

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

  // Gestión de Responsables (Sysadmin Only)
  public selectedAppForResponsibles: any | null = null;
  public responsiblesList: any[] = [];
  public loadingResponsibles = false;
  public usersList: any[] = [];
  public rolesList: any[] = [];
  public responsibleForm!: FormGroup;
  public loadingResponsibleAction = false;
  public responsibleErrorMessage = '';
  public responsibleSuccessMessage = '';

  constructor(
    public _authService: AuthService,
    private _applicationsService: ApplicationsService,
    private _typeApplicationsService: TypeApplicationsService,
    private _rolesService: RolesService,
    private _appResponsiblesService: AppResponsiblesService,
    private _usersService: UsersService,
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

    this.responsibleForm = this.fb.group({
      usr_uuid: ['', [Validators.required]],
      rol_uuid: ['', [Validators.required]]
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

  // --- MÉTODOS GESTIÓN DE RESPONSABLES ---
  public openResponsiblesManager(app: any): void {
    this.selectedAppForResponsibles = app;
    this.responsibleErrorMessage = '';
    this.responsibleSuccessMessage = '';
    this.responsibleForm.reset({
      usr_uuid: '',
      rol_uuid: ''
    });
    this.loadResponsiblesForApp(app.app_uuid);
    this.loadUsersCatalog();
    this.loadRolesCatalog();
    this.cdr.detectChanges();
  }

  public closeResponsiblesManager(): void {
    this.selectedAppForResponsibles = null;
    this.cdr.detectChanges();
  }

  public loadResponsiblesForApp(app_uuid: string): void {
    this.loadingResponsibles = true;
    this.cdr.detectChanges();
    this._appResponsiblesService.getResponsibles(app_uuid).subscribe({
      next: (response: any) => {
        this.responsiblesList = response.data || [];
        this.loadingResponsibles = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        this.loadingResponsibles = false;
        this.responsibleErrorMessage = 'Error al cargar los responsables.';
        this.cdr.detectChanges();
      }
    });
  }

  public loadUsersCatalog(): void {
    if (this.usersList.length > 0) return;
    this._usersService.getUsers().subscribe({
      next: (response: any) => {
        this.usersList = response.data?.rows || response.data || [];
        this.cdr.detectChanges();
      }
    });
  }

  public loadRolesCatalog(): void {
    if (this.rolesList.length > 0) return;
    this._rolesService.getRoles().subscribe({
      next: (response: any) => {
        this.rolesList = response.data || [];
        this.cdr.detectChanges();
      }
    });
  }

  public assignResponsible(): void {
    this.responsibleErrorMessage = '';
    this.responsibleSuccessMessage = '';

    if (this.responsibleForm.invalid || !this.selectedAppForResponsibles) {
      return;
    }

    this.loadingResponsibleAction = true;
    this.cdr.detectChanges();

    const { usr_uuid, rol_uuid } = this.responsibleForm.value;
    const app_uuid = this.selectedAppForResponsibles.app_uuid;

    this._appResponsiblesService.assignResponsible(app_uuid, usr_uuid, rol_uuid).subscribe({
      next: (response: any) => {
        this.loadingResponsibleAction = false;
        this.responsibleSuccessMessage = 'Responsable asignado con éxito.';
        this.loadResponsiblesForApp(app_uuid);
        this.responsibleForm.reset({
          usr_uuid: '',
          rol_uuid: ''
        });
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        this.loadingResponsibleAction = false;
        this.responsibleErrorMessage = err.error?.message || 'Error al asignar el responsable.';
        this.cdr.detectChanges();
      }
    });
  }

  public removeResponsible(appres_uuid: string): void {
    if (confirm('¿Estás seguro de que deseas quitar este responsable del soporte de la aplicación?')) {
      this.loadingResponsibleAction = true;
      this.cdr.detectChanges();
      this._appResponsiblesService.removeResponsible(appres_uuid).subscribe({
        next: () => {
          this.loadingResponsibleAction = false;
          this.responsibleSuccessMessage = 'Responsable desvinculado con éxito.';
          if (this.selectedAppForResponsibles) {
            this.loadResponsiblesForApp(this.selectedAppForResponsibles.app_uuid);
          }
          this.cdr.detectChanges();
        },
        error: (err: any) => {
          this.loadingResponsibleAction = false;
          this.responsibleErrorMessage = err.error?.message || 'Error al quitar el responsable.';
          this.cdr.detectChanges();
        }
      });
    }
  }
}
