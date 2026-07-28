import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { ApplicationsService } from '../../core/services/applications.service';

interface LauncherApp {
  id: string;
  app_uuid?: string;
  name: string;
  type: string;
  description: string;
  dbName: string;
  url: string;
  hasAccess: boolean;
  bkColor?: string | null;
  frColor?: string | null;
}

@Component({
  selector: 'app-launcher-tab',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './launcher-tab.component.html',
  styleUrl: './launcher-tab.component.scss',
})
export class LauncherTabComponent implements OnInit {
  launcherApps: LauncherApp[] = [];

  constructor(
    public _authService: AuthService,
    private _applicationsService: ApplicationsService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    console.log('[LauncherTab] OnInit invocado.');
    this.loadApplications();
  }

  public loadApplications(): void {
    console.log('[LauncherTab] loadApplications() iniciado.');
    this._applicationsService.getApplications().subscribe({
      next: (response: any) => {
        console.log('[LauncherTab] getApplications exitoso. Data:', response);
        if (response.success && Array.isArray(response.data)) {
          this.launcherApps = response.data.map((app: any) => ({
            id: app.app_cod || app.app_uuid,
            app_uuid: app.app_uuid,
            name: app.app_name,
            type: app.typeApplication?.tapp_name || app.typeApplication?.tapp_cod || 'Core',
            description: app.app_description,
            dbName: app.app_dbname,
            url: app.app_url,
            hasAccess: app.app_hasaccess ?? true,
            bkColor: app.typeApplication?.tapp_bkcolor || null,
            frColor: app.typeApplication?.tapp_frcolor || null
          }));
          console.log('[LauncherTab] launcherApps seteado:', this.launcherApps);
        } else {
          console.warn('[LauncherTab] La respuesta no es exitosa o data no es array:', response);
        }
        this.cdr.detectChanges();
      },
      error: (error: any) => {
        console.error('[LauncherTab] Error al cargar catálogo de launcher:', error);
        this.cdr.detectChanges();
      }
    });
  }

  public launchApp(app: LauncherApp): void {
    if (!app.app_uuid) {
      window.open(app.url, '_blank');
      return;
    }

    console.log(`[SSO] Solicitando token de intercambio para la app: ${app.name}`);
    this._authService.getSSOToken(app.app_uuid).subscribe({
      next: (response: any) => {
        if (response.success && response.data?.token) {
          const ssoUrl = `${app.url}/auth/sso?token=${response.data.token}`;
          console.log(`[Router SSO] Redirigiendo hacia: ${ssoUrl}`);
          window.open(ssoUrl, '_blank');
        } else {
          window.open(app.url, '_blank');
        }
      },
      error: () => {
        window.open(app.url, '_blank');
      }
    });
  }
}
