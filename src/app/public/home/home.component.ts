import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface ATSModule {
  id: string;
  name: string;
  type: 'Core' | 'B2B' | 'B2C' | 'Fintech';
  monetization: string;
  badgeClass: string;
  description: string;
  features: string[];
}

@Component({
  selector: 'app-home',
  imports: [
    CommonModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {

  // Módulo por defecto seleccionado/resaltado en el Hero
  activeModule: string = 'Central';
  activeModuleTitle: string = 'ATS Core Central';

  // Colección de datos correspondientes a las especificaciones de tu suite
  suiteModules: ATSModule[] = [
    {
      id: 'Central',
      name: 'ATS Core Central',
      type: 'Core',
      monetization: 'Infraestructura',
      badgeClass: 'bg-slate-100 text-slate-800',
      description: 'El corazón lógico del ecosistema. Administra la pasarela unificada de identidades (SSO), auditoría global de accesos, esquemas compartidos y la estrategia de suscripciones centralizadas.',
      features: ['Portal único de perfil', 'Gestión de planes cruzados', 'Métricas de facturación consolidadas']
    },
    {
      id: 'Community',
      name: 'ATS Community',
      type: 'B2B',
      monetization: 'SaaS por Volumen',
      badgeClass: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
      description: 'Plataforma integral orientada a la administración de unidades funcionales, reserva automatizada de áreas comunes y canalización de reclamos para clubes de campo, consorcios y asociaciones cerradas.',
      features: ['Gestión de espacios y reservas', 'Tratamiento de incidencias y reclamos', 'Anclaje estratégico B2B2C']
    },
    {
      id: 'Works',
      name: 'ATS Works',
      type: 'B2B',
      monetization: 'SaaS por Planillas',
      badgeClass: 'bg-blue-50 text-blue-700 border border-blue-200',
      description: 'Control de procesos técnicos de mantenimiento mediante planillas estructuradas e ítems dinámicos. Ideal para equipos operativos internos o contratistas externos vinculados a incidentes del consorcio.',
      features: ['Planillas de control operacionales', 'Asignación de operarios en tiempo real', 'Automatización ante alertas de Community']
    },
    {
      id: 'Market',
      name: 'ATS Market',
      type: 'B2C',
      monetization: 'Comisión por Transacción',
      badgeClass: 'bg-purple-50 text-purple-700 border border-purple-200',
      description: 'E-commerce interactivo con carrito de compras integrado. Actúa como canal de suministro de materiales e insumos tanto para administraciones como para consumidores finales de la suite.',
      features: ['Gestión avanzada de stock', 'Sincronización de inventario con obras', 'Soporte multilocal y dropshipping']
    },
    {
      id: 'Management',
      name: 'ATS Management',
      type: 'Fintech',
      monetization: 'Freemium + Insights',
      badgeClass: 'bg-amber-50 text-amber-700 border border-amber-200',
      description: 'El cerebro financiero del ecosistema. Diseñado originalmente para procesar y conciliar comprobantes y cupones de tarjetas de crédito para auditoría de egresos o cobros de expensas.',
      features: ['Conciliación automática de cupones', 'Alertas tempranas de cierres de cuenta', 'Reportes contables avanzados']
    },
    {
      id: 'GUVA',
      name: 'GUVA',
      type: 'B2C',
      monetization: 'Lead Gen / Destacados',
      badgeClass: 'bg-cyan-50 text-cyan-700 border border-cyan-200',
      description: 'Motor inteligente e indexado enfocado en la búsqueda y contratación de servicios profesionales validados, vinculándose dinámicamente con los flujos de resolución de incidentes de la suite.',
      features: ['Búsqueda inteligente por cercanía', 'Sugerencia de perfiles en reclamos', 'Monetización por posicionamiento']
    }
  ];

  constructor() { }

  ngOnInit(): void {
  }

  // Permite interactuar con los nodos del SVG cambiando los detalles descriptivos de la pantalla
  public setActiveModule(id: string): void {
    this.activeModule = id;
    const match = this.suiteModules.find(m => m.id === id);
    if (match) {
      this.activeModuleTitle = match.name;
    }
  }

}
