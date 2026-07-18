import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, UserSession } from '../../core/services/auth.service';
import { UsersService } from '../../core/services/users.service';

interface LauncherApp {
  id: string;
  name: string;
  type: 'Core' | 'B2B' | 'B2C' | 'Fintech';
  description: string;
  dbName: string;
  url: string;
  hasAccess: boolean;
}

@Component({
  selector: 'app-backoffice-suite',
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './backoffice-suite.component.html',
  styleUrl: './backoffice-suite.component.scss',
})
export class BackofficeSuiteComponent implements OnInit {

  // Navegación de pestañas secundarias
  activeTab: 'launcher' | 'audit' = 'launcher';
  
  // Vista interna de Auditoría (listado o edición Cloudflare-style)
  auditViewMode: 'list' | 'edit' = 'list';

  // Auditoría: Listado y Formulario
  usersList: any[] = [];
  loadingUsers = false;
  selectedUser: any = null;
  editForm!: FormGroup;
  submitted = false;
  loadingSave = false;
  errorMessage = '';
  successMessage = '';

  // Listado estático de las apps mapeadas desde el Core con sus permisos específicos
  launcherApps: LauncherApp[] = [
    {
      id: 'Central',
      name: 'ATS Core Central',
      type: 'Core',
      description: 'Panel maestro de configuración global, administración de planes cruzados y auditoría de federación.',
      dbName: 'db_shared_kernel',
      url: 'https://central.tuplataforma.com',
      hasAccess: true
    },
    {
      id: 'Community',
      name: 'ATS Community',
      type: 'B2B',
      description: 'Gestión de unidades funcionales, reserva de áreas comunes y canalización activa de reclamos para barrios.',
      dbName: 'db_atscommunity',
      url: 'https://comunidad.tuplataforma.com',
      hasAccess: true
    },
    {
      id: 'Works',
      name: 'ATS Works',
      type: 'B2B',
      description: 'Control operacional técnico. Generación de planillas de mantenimiento y asignación de operarios externos.',
      dbName: 'db_atsworks',
      url: 'https://works.tuplataforma.com',
      hasAccess: true
    },
    {
      id: 'Market',
      name: 'ATS Market',
      type: 'B2C',
      description: 'E-commerce integrado con carrito de compras y control avanzado de stock para suministros locales.',
      dbName: 'db_atsmarket',
      url: 'https://market.tuplataforma.com',
      hasAccess: false
    },
    {
      id: 'Management',
      name: 'ATS Management',
      type: 'Fintech',
      description: 'Procesamiento, auditoría y conciliación automática de cupones de tarjetas de crédito y expensas.',
      dbName: 'db_atsmanagement',
      url: 'https://management.tuplataforma.com',
      hasAccess: false
    },
    {
      id: 'GUVA',
      name: 'GUVA',
      type: 'B2C',
      description: 'Motor inteligente e indexado para la búsqueda y contratación de proveedores profesionales validados.',
      dbName: 'db_guva',
      url: 'https://guva.tuplataforma.com',
      hasAccess: true
    }
  ];

  constructor(
    public _authService: AuthService,
    private _usersService: UsersService,
    private fb: FormBuilder,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.editForm = this.fb.group({
      usr_nick: ['', [Validators.required]],
      usr_email: ['', [Validators.required, Validators.email]],
      usr_name: ['', [Validators.required]],
      usr_surname: ['', [Validators.required]],
      usr_sysadmin: [false]
    });
  }

  public setTab(tab: 'launcher' | 'audit'): void {
    this.activeTab = tab;
    if (tab === 'audit') {
      this.auditViewMode = 'list';
      this.loadUsers();
    }
  }

  public loadUsers(): void {
    this.loadingUsers = true;
    this.errorMessage = '';
    this._usersService.getUsers().subscribe({
      next: (response) => {
        this.loadingUsers = false;
        if (response.success && response.data) {
          this.usersList = response.data;
        } else {
          this.usersList = response.data || [];
        }
      },
      error: (error) => {
        this.loadingUsers = false;
        this.errorMessage = 'No se pudo recuperar los usuarios de la base de datos.';
      }
    });
  }

  public enterEditMode(user: any): void {
    this.selectedUser = user;
    this.auditViewMode = 'edit';
    this.submitted = false;
    this.errorMessage = '';
    this.successMessage = '';
    
    this.editForm.patchValue({
      usr_nick: user.usr_nick,
      usr_email: user.usr_email,
      usr_name: user.usr_name,
      usr_surname: user.usr_surname,
      usr_sysadmin: !!user.usr_sysadmin
    });
  }

  public exitEditMode(): void {
    this.selectedUser = null;
    this.auditViewMode = 'list';
    this.editForm.reset();
  }

  public saveEditedUser(): void {
    this.submitted = true;
    this.errorMessage = '';
    this.successMessage = '';

    if (this.editForm.invalid || !this.selectedUser) {
      return;
    }

    this.loadingSave = true;
    this._usersService.updateUser(this.selectedUser.usr_uuid, this.editForm.value).subscribe({
      next: (response) => {
        this.loadingSave = false;
        this.successMessage = 'Usuario actualizado correctamente.';
        this.loadUsers();
        
        // Retornar a la vista principal después de 1.5s
        setTimeout(() => {
          this.exitEditMode();
        }, 1500);
      },
      error: (error) => {
        this.loadingSave = false;
        this.errorMessage = error.error?.error || error.error?.message || 'Ocurrió un error al intentar actualizar el usuario.';
      }
    });
  }

  public deleteUser(usr_uuid: string): void {
    if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      this._usersService.deleteUser(usr_uuid).subscribe({
        next: () => {
          this.loadUsers();
        },
        error: () => {
          this.errorMessage = 'No se pudo eliminar el usuario seleccionado.';
        }
      });
    }
  }

  public launchApp(url: string): void {
    console.log(`[Router] Redirigiendo con token SSO activo hacia: ${url}`);
    window.open(url, '_blank');
  }

  public logout(): void {
    this._authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
