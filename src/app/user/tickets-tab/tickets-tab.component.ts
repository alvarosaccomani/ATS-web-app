import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { TicketsService } from '../../core/services/tickets.service';
import { ApplicationsService } from '../../core/services/applications.service';
import { SocketService } from '../../core/services/socket.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-tickets-tab',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './tickets-tab.component.html',
  styleUrl: './tickets-tab.component.scss'
})
export class TicketsTabComponent implements OnInit, OnDestroy {
  // Estado de Tickets y Listados
  public tickets: any[] = [];
  public applications: any[] = [];
  public loadingTickets = false;

  // Estado de Paginación
  public page = 1;
  public perPage = 10;
  public total = 0;
  public totalPages = 1;
  public showingFrom = 0;
  public showingTo = 0;

  // Filtros
  public selectedStatus = '';
  public selectedType = '';
  public selectedAppUuid = '';

  // Formulario y Modales
  public selectedTicket: any = null;
  public ticketForm!: FormGroup;
  public submitting = false;
  public errorMessage = '';
  public successMessage = '';
  public activePreviewImage: string | null = null;

  // Carga de Ticket
  public ticketsViewMode: 'list' | 'create' = 'list';
  public createForm!: FormGroup;
  public createBase64Images: string[] = [];

  private socketSubs: Subscription[] = [];

  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private _ticketsService: TicketsService,
    private _appsService: ApplicationsService,
    private _socketService: SocketService,
    public _authService: AuthService
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.loadApplications();
    this.loadTickets();

    // Suscribirse a sockets para tiempo real
    this.socketSubs.push(
      this._socketService.onEvent<any>('ticket_created').subscribe((newTicket) => {
        // Recargar si estamos en la primera página para ver el nuevo
        if (this.page === 1) {
          this.loadTickets();
        }
      })
    );
    this.socketSubs.push(
      this._socketService.onEvent<any>('ticket_updated').subscribe((updatedTicket) => {
        // Actualizar el ticket en la lista si existe
        const idx = this.tickets.findIndex(t => t.tic_uuid === updatedTicket.tic_uuid);
        if (idx !== -1) {
          // Mantener metadatos de relación si los tenía cargados
          this.tickets[idx] = { ...this.tickets[idx], ...updatedTicket };
          if (this.selectedTicket && this.selectedTicket.tic_uuid === updatedTicket.tic_uuid) {
            this.selectedTicket = { ...this.selectedTicket, ...updatedTicket };
          }
          this.cdr.detectChanges();
        }
      })
    );
    this.socketSubs.push(
      this._socketService.onEvent<any>('ticket_deleted').subscribe((deletedTicket) => {
        this.loadTickets();
        if (this.selectedTicket && this.selectedTicket.tic_uuid === deletedTicket.tic_uuid) {
          this.selectedTicket = null;
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.socketSubs.forEach(sub => sub.unsubscribe());
  }

  private initForm(): void {
    this.ticketForm = this.fb.group({
      tic_status: ['PENDING', Validators.required],
      tic_priority: ['MEDIUM', Validators.required],
      tic_admincomment: ['']
    });

    this.createForm = this.fb.group({
      app_uuid: ['', Validators.required],
      tic_type: ['BUG', Validators.required],
      tic_title: ['', [Validators.required, Validators.maxLength(100)]],
      tic_description: ['', [Validators.required, Validators.maxLength(500)]]
    });
  }

  public loadApplications(): void {
    this._appsService.getApplications().subscribe({
      next: (response: any) => {
        if (response.success && Array.isArray(response.data)) {
          this.applications = response.data;
          this.cdr.detectChanges();
        }
      }
    });
  }

  public loadTickets(): void {
    this.loadingTickets = true;
    this.cdr.detectChanges();

    const isAdmin = this._authService.currentUser()?.usr_sysadmin;

    if (isAdmin) {
      const filters = {
        status: this.selectedStatus || undefined,
        type: this.selectedType || undefined,
        app_uuid: this.selectedAppUuid || undefined,
        page: this.page,
        perPage: this.perPage
      };

      this._ticketsService.getTickets(filters).subscribe({
        next: (response: any) => {
          this.loadingTickets = false;
          if (response.success) {
            this.tickets = response.data || [];
            this.total = response.total || 0;
            this.totalPages = response.totalPages || 1;
            this.showingFrom = response.item || 0;
            this.showingTo = response.itemOf || 0;
          }
          this.cdr.detectChanges();
        },
        error: () => {
          this.loadingTickets = false;
          this.cdr.detectChanges();
        }
      });
    } else {
      this._ticketsService.getMyTickets().subscribe({
        next: (response: any) => {
          this.loadingTickets = false;
          if (response.success && Array.isArray(response.data)) {
            this.tickets = response.data;
            this.total = this.tickets.length;
            this.totalPages = 1;
            this.showingFrom = this.tickets.length > 0 ? 1 : 0;
            this.showingTo = this.tickets.length;
          }
          this.cdr.detectChanges();
        },
        error: () => {
          this.loadingTickets = false;
          this.cdr.detectChanges();
        }
      });
    }
  }

  public applyFilters(): void {
    this.page = 1;
    this.loadTickets();
  }

  public resetFilters(): void {
    this.selectedStatus = '';
    this.selectedType = '';
    this.selectedAppUuid = '';
    this.page = 1;
    this.loadTickets();
  }

  public changePage(newPage: number): void {
    if (newPage >= 1 && newPage <= this.totalPages) {
      this.page = newPage;
      this.loadTickets();
    }
  }

  public viewTicket(ticket: any): void {
    this.selectedTicket = ticket;
    this.errorMessage = '';
    this.successMessage = '';
    this.ticketForm.patchValue({
      tic_status: ticket.tic_status,
      tic_priority: ticket.tic_priority,
      tic_admincomment: ticket.tic_admincomment || ''
    });

    // Cargar detalles para obtener historial de cambios
    this._ticketsService.getTicketById(ticket.tic_uuid).subscribe({
      next: (response: any) => {
        if (response.success && response.data) {
          this.selectedTicket = response.data;
          this.cdr.detectChanges();
        }
      }
    });

    this.cdr.detectChanges();
  }

  public closeDetail(): void {
    this.selectedTicket = null;
    this.cdr.detectChanges();
  }

  public saveTicketStatus(): void {
    if (this.ticketForm.invalid || !this.selectedTicket) return;

    this.submitting = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.cdr.detectChanges();

    const formValues = this.ticketForm.value;

    this._ticketsService.updateTicket(this.selectedTicket.tic_uuid, formValues).subscribe({
      next: (response: any) => {
        this.submitting = false;
        if (response.success) {
          this.successMessage = 'Ticket actualizado con éxito.';
          this.loadTickets();
          
          // Recargar detalles actualizados para el timeline
          this._ticketsService.getTicketById(this.selectedTicket.tic_uuid).subscribe({
            next: (detailResp: any) => {
              if (detailResp.success && detailResp.data) {
                this.selectedTicket = detailResp.data;
                this.ticketForm.patchValue({
                  tic_admincomment: '' // Limpiar comentario cargado
                });
                this.cdr.detectChanges();
              }
            }
          });
        } else {
          this.errorMessage = response.message || 'No se pudo actualizar el ticket.';
        }
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        this.submitting = false;
        this.errorMessage = err.error?.message || 'Error al conectar con la API.';
        this.cdr.detectChanges();
      }
    });
  }

  public deleteTicket(tic_uuid: string): void {
    if (!confirm('¿Estás seguro de que deseas eliminar este ticket permanentemente?')) return;

    this._ticketsService.deleteTicket(tic_uuid).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.loadTickets();
          if (this.selectedTicket && this.selectedTicket.tic_uuid === tic_uuid) {
            this.selectedTicket = null;
          }
          this.cdr.detectChanges();
        }
      }
    });
  }

  public parseMetadata(metadataStr: string | null): any {
    if (!metadataStr) return null;
    try {
      return JSON.parse(metadataStr);
    } catch {
      return { info: metadataStr };
    }
  }

  public getKeys(obj: any): string[] {
    return obj ? Object.keys(obj) : [];
  }

  public enterCreateMode(): void {
    this.ticketsViewMode = 'create';
    this.errorMessage = '';
    this.successMessage = '';
    this.createBase64Images = [];
    this.createForm.reset({
      tic_type: 'BUG',
      app_uuid: ''
    });
    this.cdr.detectChanges();
  }

  public exitCreateMode(): void {
    this.ticketsViewMode = 'list';
    this.errorMessage = '';
    this.successMessage = '';
    this.createBase64Images = [];
    this.createForm.reset();
    this.cdr.detectChanges();
  }

  public onCreateFilesSelected(event: any): void {
    const files: FileList = event.target.files;
    if (!files) return;

    const remainingSlots = 2 - this.createBase64Images.length;
    const filesToUpload = Array.from(files).slice(0, remainingSlots);

    filesToUpload.forEach(file => {
      if (!file.type.startsWith('image/')) return;
      this.compressImage(file).then(base64 => {
        this.createBase64Images.push(base64);
        this.cdr.detectChanges();
      }).catch(err => {
        console.error('Error comprimiendo imagen:', err);
      });
    });
  }

  public removeCreateImage(index: number): void {
    this.createBase64Images.splice(index, 1);
    this.cdr.detectChanges();
  }

  public saveNewTicket(): void {
    if (this.createForm.invalid || this.submitting) return;

    this.submitting = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.cdr.detectChanges();

    const formValues = this.createForm.value;

    const payload = {
      ...formValues,
      tic_images: this.createBase64Images.length > 0 ? this.createBase64Images : null,
      tic_metadata: JSON.stringify({
        userAgent: window.navigator.userAgent,
        screenWidth: window.screen.width,
        screenHeight: window.screen.height,
        location: window.location.href,
        timestamp: new Date().toISOString()
      })
    };

    this._ticketsService.saveTicket(payload).subscribe({
      next: (response: any) => {
        this.submitting = false;
        if (response.success) {
          this.successMessage = 'Ticket reportado con éxito.';
          this.loadTickets();
          this.cdr.detectChanges();
          setTimeout(() => this.exitCreateMode(), 1500);
        } else {
          this.errorMessage = response.message || 'No se pudo reportar el ticket.';
          this.cdr.detectChanges();
        }
      },
      error: (err: any) => {
        this.submitting = false;
        this.errorMessage = err.error?.message || 'Error al conectar con la API de soporte.';
        this.cdr.detectChanges();
      }
    });
  }

  private compressImage(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event: any) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 1000;
          const MAX_HEIGHT = 600;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const dataUrl = canvas.toDataURL('image/jpeg', 0.70);
            resolve(dataUrl);
          } else {
            resolve(event.target.result);
          }
        };
        img.src = event.target.result;
      };
      reader.onerror = error => reject(error);
      reader.readAsDataURL(file);
    });
  }
}
