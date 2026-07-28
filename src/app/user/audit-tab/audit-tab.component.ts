import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { UsersService } from '../../core/services/users.service';
import { UserAuthLogsService, UserAuthLogItem } from '../../core/services/user-auth-logs.service';
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

  private socketSubs: Subscription[] = [];

  constructor(
    public _authService: AuthService,
    private _usersService: UsersService,
    private _userAuthLogsService: UserAuthLogsService,
    private _socketService: SocketService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadUsers();
    this.loadAuditLogs();
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
    this._usersService.getUsers().subscribe({
      next: (response: any) => {
        this.loadingUsers = false;
        this.usersList = response.data || [];
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
    this._userAuthLogsService.getUserAuthLogs().subscribe({
      next: (response: any) => {
        this.loadingAuditLogs = false;
        if (response.success && Array.isArray(response.data)) {
          this.auditLogs = response.data;
        }
        this.cdr.detectChanges();
      },
      error: () => {
        this.loadingAuditLogs = false;
        this.cdr.detectChanges();
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
