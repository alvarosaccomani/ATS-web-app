import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { forkJoin } from 'rxjs';
import { ApplicationSettingsService, ApplicationSettingInterface } from '../../core/services/application-settings.service';
import { ApplicationsService } from '../../core/services/applications.service';

@Component({
  selector: 'app-application-settings-tab',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './application-settings-tab.component.html',
  styleUrl: './application-settings-tab.component.scss',
})
export class ApplicationSettingsTabComponent implements OnInit {
  public settings: ApplicationSettingInterface[] = [];
  public groupedSettings: { groupName: string, items: ApplicationSettingInterface[] }[] = [];
  public isLoading = true;
  public loadingSave = false;
  public app_uuid = '';
  public appName = '';
  public successMessage = '';
  public errorMessage = '';

  constructor(
    private _route: ActivatedRoute,
    private _settingsService: ApplicationSettingsService,
    private _applicationsService: ApplicationsService,
    private _location: Location,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this._route.params.subscribe(params => {
      this.app_uuid = params['app_uuid'];
      if (this.app_uuid) {
        this.loadSettings();
        this.loadAppName();
      }
    });
  }

  private loadAppName(): void {
    this._applicationsService.getApplicationById(this.app_uuid).subscribe({
      next: (response: any) => {
        if (response.success && response.data) {
          this.appName = response.data.app_name;
          this.cdr.detectChanges();
        }
      },
      error: () => {}
    });
  }

  private loadSettings(): void {
    this.isLoading = true;
    this.cdr.detectChanges();
    this._settingsService.getApplicationsSettings(this.app_uuid).subscribe({
      next: (response) => {
        const dbSettings: ApplicationSettingInterface[] = response?.data || [];
        this.mergeSettings(dbSettings);
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar settings', err);
        this.mergeSettings([]);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  private mergeSettings(dbSettings: ApplicationSettingInterface[]): void {
    const schema = this.getSettingsSchema();
    this.settings = schema.map(schemaItem => {
      const existing = dbSettings.find(db => db.apps_key === schemaItem.apps_key);
      if (existing) {
        return {
          ...existing,
          apps_parameter: schemaItem.apps_parameter,
          apps_description: schemaItem.apps_description,
          apps_group: schemaItem.apps_group,
          apps_options: schemaItem.apps_options
        };
      }
      return { ...schemaItem };
    });

    this.groupSettingsByCategory();
  }

  private groupSettingsByCategory(): void {
    const groupsMap = new Map<string, ApplicationSettingInterface[]>();

    for (const setting of this.settings) {
      const group = setting.apps_group || 'General';
      if (!groupsMap.has(group)) {
        groupsMap.set(group, []);
      }
      groupsMap.get(group)!.push(setting);
    }

    this.groupedSettings = Array.from(groupsMap.entries()).map(([groupName, items]) => ({
      groupName,
      items
    }));
  }

  public getOptions(optionsString: string): string[] {
    if (!optionsString) return [];
    try {
      const parsed = JSON.parse(optionsString);
      if (Array.isArray(parsed)) return parsed;
    } catch (e) {}
    return optionsString.split(',').map(s => s.trim());
  }

  public getBooleanValue(val: string): boolean {
    return val === 'true';
  }

  public setBooleanValue(setting: ApplicationSettingInterface, val: boolean): void {
    setting.apps_value = val ? 'true' : 'false';
  }

  private getSettingsSchema(): ApplicationSettingInterface[] {
    return [
      {
        app_uuid: this.app_uuid,
        apps_uuid: '1',
        apps_key: 'email_header_bg',
        apps_parameter: 'Color de Fondo Cabecera Email',
        apps_description: 'Color hexadecimal o gradiente CSS para el fondo del banner superior de los correos.',
        apps_datatype: 'color',
        apps_value: '#0f172a',
        apps_group: 'Emails y Notificaciones',
        apps_options: '',
        apps_updatedat: new Date(),
        apps_createdat: new Date()
      },
      {
        app_uuid: this.app_uuid,
        apps_uuid: '2',
        apps_key: 'email_header_text',
        apps_parameter: 'Color de Texto Cabecera Email',
        apps_description: 'Color hexadecimal para el título del ecosistema de la app en la cabecera del correo.',
        apps_datatype: 'color',
        apps_value: '#ffffff',
        apps_group: 'Emails y Notificaciones',
        apps_options: '',
        apps_updatedat: new Date(),
        apps_createdat: new Date()
      },
      {
        app_uuid: this.app_uuid,
        apps_uuid: '3',
        apps_key: 'email_logo_url',
        apps_parameter: 'URL del Logotipo del Email',
        apps_description: 'Dirección web pública absoluta del logotipo a incluir sobre el encabezado del mail.',
        apps_datatype: 'string',
        apps_value: '',
        apps_group: 'Emails y Notificaciones',
        apps_options: '',
        apps_updatedat: new Date(),
        apps_createdat: new Date()
      },
      {
        app_uuid: this.app_uuid,
        apps_uuid: '4',
        apps_key: 'email_signature_name',
        apps_parameter: 'Nombre de la Firma del Email',
        apps_description: 'Firma a pie de página incluida en las notificaciones transaccionales automáticas.',
        apps_datatype: 'string',
        apps_value: '',
        apps_group: 'Emails y Notificaciones',
        apps_options: '',
        apps_updatedat: new Date(),
        apps_createdat: new Date()
      }
    ];
  }

  public onSave(): void {
    this.loadingSave = true;
    this.successMessage = '';
    this.errorMessage = '';
    this.cdr.detectChanges();

    const saveRequests = this.settings.map(setting => {
      const payload = { ...setting };
      payload.app_uuid = this.app_uuid;

      // Si es un ID temporal de esquema (ej. '1', '2'), se considera nuevo registro
      const isNew = !payload.apps_uuid || payload.apps_uuid.length < 5;

      if (isNew) {
        const { apps_uuid, ...newPayload } = payload;
        return this._settingsService.saveApplicationSetting(newPayload);
      } else {
        return this._settingsService.updateApplicationSetting(payload);
      }
    });

    if (saveRequests.length === 0) {
      this.loadingSave = false;
      this.cdr.detectChanges();
      return;
    }

    forkJoin(saveRequests).subscribe({
      next: () => {
        this.loadingSave = false;
        this.successMessage = 'Las configuraciones se guardaron correctamente.';
        this.cdr.detectChanges();
        this.loadSettings();
        setTimeout(() => this.onCancel(), 1500);
      },
      error: (err) => {
        console.error('Error al guardar ajustes:', err);
        this.loadingSave = false;
        this.errorMessage = 'Hubo un error al procesar el guardado de configuraciones.';
        this.cdr.detectChanges();
      }
    });
  }

  public onCancel(): void {
    this._location.back();
  }
}
