import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { UsersService } from '../../core/services/users.service';
import { UserAuthLogsService, UserAuthLogItem } from '../../core/services/user-auth-logs.service';
import { SystemEventsService, SystemEventItem } from '../../core/services/system-events.service';
import { SocketService } from '../../core/services/socket.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-audit-tab',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './audit-tab.component.html',
  styleUrl: './audit-tab.component.scss',
})
export class AuditTabComponent implements OnInit, OnDestroy {
  public auditViewMode: 'list' | 'edit' = 'list';
  
  // Auditoría: Listado y Formulario
  usersList: any[] = [];
  loadingUsers = false;
  selectedUser: any = null;
  editForm!: FormGroup;
  submitted = false;
  loadingSave = false;
  errorMessage = '';
  successMessage = '';

  public auditLogs: UserAuthLogItem[] = [];
  public loadingAuditLogs = false;

  public activeLogsTab: 'auth' | 'system' = 'auth';
  public systemEvents: SystemEventItem[] = [];
  public loadingSystemEvents = false;

  // Variables de Paginación
  public usersPage = 1;
  public usersPerPage = 10;
  public usersTotal = 0;
  public usersTotalPages = 1;
  public usersShowingFrom = 0;
  public usersShowingTo = 0;

  public authLogsPage = 1;
  public authLogsPerPage = 10;
  public authLogsTotal = 0;
  public authLogsTotalPages = 1;
  public authLogsShowingFrom = 0;
  public authLogsShowingTo = 0;

  public systemEventsPage = 1;
  public systemEventsPerPage = 10;
  public systemEventsTotal = 0;
  public systemEventsTotalPages = 1;
  public systemEventsShowingFrom = 0;
  public systemEventsShowingTo = 0;

  private socketSubs: Subscription[] = [];

  constructor(
    public _authService: AuthService,
    private _usersService: UsersService,
    private _userAuthLogsService: UserAuthLogsService,
    private _systemEventsService: SystemEventsService,
    private _socketService: SocketService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadUsers();
    this.loadAuditLogs();
    this.loadSystemEvents();
    this.setupSocketListeners();
  }

  ngOnDestroy(): void {
    this.socketSubs.forEach(sub => sub.unsubscribe());
  }

  private initForm(): void {
    this.editForm = this.fb.group({
      usr_nick: ['', [Validators.required]],
      usr_email: ['', [Validators.required, Validators.email]],
      usr_name: ['', [Validators.required]],
      usr_surname: ['', [Validators.required]],
      usr_sysadmin: [false],
      usr_confirmed: [false]
    });
  }

  private setupSocketListeners(): void {
    this.socketSubs.push(
      this._socketService.onEvent<any>('user_created').subscribe(() => {
        this.loadUsers();
      })
    );
    this.socketSubs.push(
      this._socketService.onEvent<any>('user_deleted').subscribe(() => {
        this.loadUsers();
      })
    );
    this.socketSubs.push(
      this._socketService.onEvent<any>('auth_log_created').subscribe(() => {
        this.loadAuditLogs();
      })
    );
  }

  public loadUsers(): void {
    this.loadingUsers = true;
    this.errorMessage = '';
    this.cdr.detectChanges();
    this._usersService.getUsers('all', this.usersPage, this.usersPerPage).subscribe({
      next: (response: any) => {
        this.loadingUsers = false;
        this.usersList = response.data || [];
        this.usersTotal = response.total || 0;
        this.usersTotalPages = response.totalPages || 1;
        this.usersShowingFrom = response.item || 0;
        this.usersShowingTo = response.itemOf || 0;
        this.cdr.detectChanges();
      },
      error: (error: any) => {
        this.loadingUsers = false;
        this.errorMessage = 'No se pudo recuperar los usuarios de la base de datos.';
        this.cdr.detectChanges();
      }
    });
  }

  public loadAuditLogs(): void {
    this.loadingAuditLogs = true;
    this.cdr.detectChanges();
    this._userAuthLogsService.getUserAuthLogs(this.authLogsPage, this.authLogsPerPage).subscribe({
      next: (response: any) => {
        this.loadingAuditLogs = false;
        if (response.success) {
          this.auditLogs = response.data || [];
          this.authLogsTotal = response.total || 0;
          this.authLogsTotalPages = response.totalPages || 1;
          this.authLogsShowingFrom = response.item || 0;
          this.authLogsShowingTo = response.itemOf || 0;
        }
        this.cdr.detectChanges();
      },
      error: () => {
        this.loadingAuditLogs = false;
        this.cdr.detectChanges();
      }
    });
  }

  public loadSystemEvents(): void {
    this.loadingSystemEvents = true;
    this.cdr.detectChanges();
    this._systemEventsService.getSystemEvents(this.systemEventsPage, this.systemEventsPerPage).subscribe({
      next: (response: any) => {
        this.loadingSystemEvents = false;
        if (response.success) {
          this.systemEvents = response.data || [];
          this.systemEventsTotal = response.total || 0;
          this.systemEventsTotalPages = response.totalPages || 1;
          this.systemEventsShowingFrom = response.item || 0;
          this.systemEventsShowingTo = response.itemOf || 0;
        }
        this.cdr.detectChanges();
      },
      error: () => {
        this.loadingSystemEvents = false;
        this.cdr.detectChanges();
      }
    });
  }

  // Métodos de cambio de página
  public changeUsersPage(page: number): void {
    if (page >= 1 && page <= this.usersTotalPages) {
      this.usersPage = page;
      this.loadUsers();
    }
  }

  public changeAuthPage(page: number): void {
    if (page >= 1 && page <= this.authLogsTotalPages) {
      this.authLogsPage = page;
      this.loadAuditLogs();
    }
  }

  public changeSystemPage(page: number): void {
    if (page >= 1 && page <= this.systemEventsTotalPages) {
      this.systemEventsPage = page;
      this.loadSystemEvents();
    }
  }

  public formatDetailsShort(details: any): string {
    if (!details) return 'N/A';
    if (typeof details === 'string') {
      return details;
    }
    return JSON.stringify(details);
  }

  public formatDetailsLong(details: any): string {
    if (!details) return 'N/A';
    if (typeof details === 'string') {
      try {
        return JSON.stringify(JSON.parse(details), null, 2);
      } catch {
        return details;
      }
    }
    return JSON.stringify(details, null, 2);
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
      usr_sysadmin: !!user.usr_sysadmin,
      usr_confirmed: !!user.usr_confirmed
    });
    this.cdr.detectChanges();
  }

  public exitEditMode(): void {
    this.selectedUser = null;
    this.auditViewMode = 'list';
    this.editForm.reset();
    this.cdr.detectChanges();
  }

  public saveEditedUser(): void {
    this.submitted = true;
    this.errorMessage = '';
    this.successMessage = '';

    if (this.editForm.invalid || !this.selectedUser) {
      return;
    }

    this.loadingSave = true;
    this.cdr.detectChanges();
    this._usersService.updateUser(this.selectedUser.usr_uuid, this.editForm.value).subscribe({
      next: (response: any) => {
        this.loadingSave = false;
        this.successMessage = 'Usuario actualizado correctamente.';
        this.cdr.detectChanges();
        this.loadUsers();
        
        setTimeout(() => {
          this.exitEditMode();
        }, 1500);
      },
      error: (error: any) => {
        this.loadingSave = false;
        this.errorMessage = error.error?.error || error.error?.message || 'Ocurrió un error al intentar actualizar el usuario.';
        this.cdr.detectChanges();
      }
    });
  }

  public deleteUser(usr_uuid: string): void {
    if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      this._usersService.deleteUser(usr_uuid).subscribe({
        next: () => {
          this.loadUsers();
          this.cdr.detectChanges();
        },
        error: () => {
          this.errorMessage = 'No se pudo eliminar el usuario seleccionado.';
          this.cdr.detectChanges();
        }
      });
    }
  }
}
