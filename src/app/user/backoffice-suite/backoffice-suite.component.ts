import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface LauncherApp {
  id: string;
  name: string;
  type: 'Core' | 'B2B' | 'B2C' | 'Fintech';
  description: string;
  dbName: string;
  url: string;
  hasAccess: boolean;
}

interface UserPayload {
  usr_Uuid: string;
  email: string;
  name: string;
  surname: string;
  isSysAdmin: boolean;
}

@Component({
  selector: 'app-backoffice-suite',
  imports: [
    CommonModule
  ],
  templateUrl: './backoffice-suite.component.html',
  styleUrl: './backoffice-suite.component.scss',
})
export class BackofficeSuiteComponent implements OnInit {

  // Payload simulado extraído tras la decodificación del token del Silent SSO
  userSession: UserPayload = {
    usr_Uuid: 'e4b29f74-3aa8-4f5f-8769-e127ce4a32d6',
    email: 'admin@barriocerrado.com',
    name: 'Mariano',
    surname: 'Rodríguez',
    isSysAdmin: true // Habilita la solapa de auditoría en el sidebar
  };

  // Listado de las apps mapeadas desde el Core con sus permisos específicos para este usuario
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
      hasAccess: false // Deshabilitado: el usuario no contrató este módulo para su empresa
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

  constructor() { }

  ngOnInit(): void { }

  // Simulación de redirección controlada por el Router/Window a los subdominios de cada micro-frontend
  public launchApp(url: string): void {
    console.log(`[Router] Redirigiendo silenciosamente con token SSO activo hacia: ${url}`);
    // window.location.href = url;
  }

  public logout(): void {
    console.log('[SSO] Destruyendo cookie de sesión segura Domain=.tuplataforma.com');
  }
}
