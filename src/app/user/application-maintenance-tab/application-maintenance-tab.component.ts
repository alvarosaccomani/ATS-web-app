import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ApplicationsService } from '../../core/services/applications.service';
import { ApplicationUpdatesService } from '../../core/services/application-updates.service';
import { ApplicationBackupsService } from '../../core/services/application-backups.service';
import { ApplicationMaintenancesService } from '../../core/services/application-maintenances.service';

@Component({
  selector: 'app-application-maintenance-tab',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './application-maintenance-tab.component.html',
  styleUrl: './application-maintenance-tab.component.scss'
})
export class ApplicationMaintenanceTabComponent implements OnInit {
  public app_uuid = '';
  public appName = '';
  public appCod = '';
  public appDbName = '';

  // Control de vistas
  public activeTab: 'updates' | 'backups' | 'maintenances' = 'updates';
  public showUpdateForm = false;
  public showBackupForm = false;
  public showMaintForm = false;

  // Listas de datos
  public updatesList: any[] = [];
  public backupsList: any[] = [];
  public maintenancesList: any[] = [];

  // Loadings
  public isLoadingData = false;
  public isSubmitting = false;

  // Formularios
  public updateForm!: FormGroup;
  public backupForm!: FormGroup;
  public maintForm!: FormGroup;

  // Mensajes
  public successMessage = '';
  public errorMessage = '';

  constructor(
    private _route: ActivatedRoute,
    private _location: Location,
    private _applicationsService: ApplicationsService,
    private _updatesService: ApplicationUpdatesService,
    private _backupsService: ApplicationBackupsService,
    private _maintenancesService: ApplicationMaintenancesService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this._route.params.subscribe(params => {
      this.app_uuid = params['app_uuid'];
      if (this.app_uuid) {
        this.loadAppDetails();
        this.loadTabInfo();
      }
    });

    this.initFormularios();
  }

  private initFormularios(): void {
    this.updateForm = this.fb.group({
      appup_version: ['', [Validators.required, Validators.pattern(/^v?\d+(\.\d+)*$/)]],
      appup_description: ['', [Validators.required, Validators.minLength(5)]]
    });

    this.backupForm = this.fb.group({
      appbak_filename: ['', [Validators.required]],
      appbak_size: [0, [Validators.required, Validators.min(1)]],
      appbak_status: ['SUCCESS', [Validators.required]],
      appbak_storagepath: ['', [Validators.required]]
    });

    this.maintForm = this.fb.group({
      appmaint_type: ['DB_INDEX_REBUILD', [Validators.required]],
      appmaint_title: ['', [Validators.required]],
      appmaint_description: ['', [Validators.required]],
      appmaint_status: ['SUCCESS', [Validators.required]]
    });
  }

  private loadAppDetails(): void {
    this._applicationsService.getApplicationById(this.app_uuid).subscribe({
      next: (response: any) => {
        if (response.success && response.data) {
          this.appName = response.data.app_name;
          this.appCod = response.data.app_cod;
          this.appDbName = response.data.app_dbname;
          this.cdr.detectChanges();
        }
      }
    });
  }

  public changeTab(tab: 'updates' | 'backups' | 'maintenances'): void {
    this.activeTab = tab;
    this.successMessage = '';
    this.errorMessage = '';
    this.closeAllForms();
    this.loadTabInfo();
  }

  public loadTabInfo(): void {
    this.isLoadingData = true;
    this.cdr.detectChanges();

    if (this.activeTab === 'updates') {
      this._updatesService.getAppUpdates(this.app_uuid).subscribe({
        next: (res: any) => {
          this.updatesList = res.data || [];
          this.isLoadingData = false;
          this.cdr.detectChanges();
        },
        error: () => {
          this.isLoadingData = false;
          this.cdr.detectChanges();
        }
      });
    } else if (this.activeTab === 'backups') {
      this._backupsService.getAppBackups(this.app_uuid).subscribe({
        next: (res: any) => {
          this.backupsList = res.data || [];
          this.isLoadingData = false;
          this.cdr.detectChanges();
        },
        error: () => {
          this.isLoadingData = false;
          this.cdr.detectChanges();
        }
      });
    } else if (this.activeTab === 'maintenances') {
      this._maintenancesService.getAppMaintenances(this.app_uuid).subscribe({
        next: (res: any) => {
          this.maintenancesList = res.data || [];
          this.isLoadingData = false;
          this.cdr.detectChanges();
        },
        error: () => {
          this.isLoadingData = false;
          this.cdr.detectChanges();
        }
      });
    }
  }

  public submitUpdate(): void {
    if (this.updateForm.invalid) return;
    this.isSubmitting = true;
    this.successMessage = '';
    this.errorMessage = '';
    this.cdr.detectChanges();

    this._updatesService.createAppUpdate(this.app_uuid, this.updateForm.value).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.successMessage = 'Actualización registrada con éxito.';
        this.showUpdateForm = false;
        this.updateForm.reset();
        this.loadTabInfo();
      },
      error: (err: any) => {
        this.isSubmitting = false;
        this.errorMessage = err.error?.message || 'Error al registrar actualización.';
        this.cdr.detectChanges();
      }
    });
  }

  public submitBackup(): void {
    if (this.backupForm.invalid) return;
    this.isSubmitting = true;
    this.successMessage = '';
    this.errorMessage = '';
    this.cdr.detectChanges();

    this._backupsService.createAppBackup(this.app_uuid, this.backupForm.value).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.successMessage = 'Backup registrado con éxito.';
        this.showBackupForm = false;
        this.backupForm.reset({ appbak_status: 'SUCCESS' });
        this.loadTabInfo();
      },
      error: (err: any) => {
        this.isSubmitting = false;
        this.errorMessage = err.error?.message || 'Error al registrar backup.';
        this.cdr.detectChanges();
      }
    });
  }

  public submitMaint(): void {
    if (this.maintForm.invalid) return;
    this.isSubmitting = true;
    this.successMessage = '';
    this.errorMessage = '';
    this.cdr.detectChanges();

    this._maintenancesService.createAppMaintenance(this.app_uuid, this.maintForm.value).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.successMessage = 'Mantenimiento registrado con éxito.';
        this.showMaintForm = false;
        this.maintForm.reset({ appmaint_type: 'DB_INDEX_REBUILD', appmaint_status: 'SUCCESS' });
        this.loadTabInfo();
      },
      error: (err: any) => {
        this.isSubmitting = false;
        this.errorMessage = err.error?.message || 'Error al registrar mantenimiento.';
        this.cdr.detectChanges();
      }
    });
  }

  public closeAllForms(): void {
    this.showUpdateForm = false;
    this.showBackupForm = false;
    this.showMaintForm = false;
  }

  public formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  public goBack(): void {
    this._location.back();
  }
}
