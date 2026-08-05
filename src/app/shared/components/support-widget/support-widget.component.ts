import { Component, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-support-widget',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './support-widget.component.html',
  styleUrl: './support-widget.component.scss',
})
export class SupportWidgetComponent implements OnInit {
  @Input() appUuid: string = '';
  @Input() apiUrlTickets: string = environment.apiUrlTickets;

  public isOpen = false;
  public submitting = false;
  public isSuccess = false;
  public errorMessage = '';
  public supportForm!: FormGroup;
  public base64Images: string[] = [];

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    // Si no se provee un appUuid, podemos intentar deducir o dejar vacío
    if (!this.appUuid) {
      this.appUuid = '8375f64d-e7b3-44a8-a12a-8d2cb6cf5957';
    }
  }

  private initForm(): void {
    this.supportForm = this.fb.group({
      tic_type: ['BUG', Validators.required],
      tic_title: ['', [Validators.required, Validators.maxLength(100)]],
      tic_description: ['', [Validators.required, Validators.maxLength(500)]]
    });
  }

  public toggleWidget(): void {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.isSuccess = false;
      this.errorMessage = '';
      this.base64Images = [];
      this.supportForm.reset({
        tic_type: 'BUG'
      });
    }
    this.cdr.detectChanges();
  }

  public onFilesSelected(event: any): void {
    const files: FileList = event.target.files;
    if (!files) return;

    // Límite de 2 imágenes máximo en total
    const remainingSlots = 2 - this.base64Images.length;
    const filesToUpload = Array.from(files).slice(0, remainingSlots);

    filesToUpload.forEach(file => {
      if (!file.type.startsWith('image/')) return;
      this.compressImage(file).then(base64 => {
        this.base64Images.push(base64);
        this.cdr.detectChanges();
      }).catch(err => {
        console.error('Error comprimiendo imagen:', err);
      });
    });
  }

  public removeImage(index: number): void {
    this.base64Images.splice(index, 1);
    this.cdr.detectChanges();
  }

  public onSubmit(): void {
    if (this.supportForm.invalid || this.submitting) return;

    this.submitting = true;
    this.errorMessage = '';

    const body = {
      ...this.supportForm.value,
      app_uuid: this.appUuid,
      tic_images: this.base64Images.length > 0 ? this.base64Images : null,
      tic_metadata: JSON.stringify({
        userAgent: window.navigator.userAgent,
        screenWidth: window.screen.width,
        screenHeight: window.screen.height,
        location: window.location.href,
        timestamp: new Date().toISOString()
      })
    };

    // Autenticado por cookie ats_token si estamos en el mismo wildcard
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    this.http.post<any>(`${this.apiUrlTickets}ticket`, body, { headers, withCredentials: true }).subscribe({
      next: (response) => {
        this.submitting = false;
        if (response.success) {
          this.isSuccess = true;
          this.cdr.detectChanges();
          setTimeout(() => {
            this.isOpen = false;
            this.cdr.detectChanges();
          }, 3500);
        } else {
          this.errorMessage = response.message || 'Error al procesar el reporte.';
          this.cdr.detectChanges();
        }
      },
      error: (err) => {
        this.submitting = false;
        this.errorMessage = err.error?.message || 'Error de conexión con la API de soporte.';
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
          const MAX_WIDTH = 1000; // Redimensionamos un poco más chico para ahorrar espacio en JSONB
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
            // Comprime a JPEG con calidad 70%
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
