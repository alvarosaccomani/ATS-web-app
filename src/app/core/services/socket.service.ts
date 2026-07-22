import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: Socket;

  constructor() {
    // Extrae la URL base del servidor (ej: http://localhost:3005) a partir de apiUrl
    const serverUrl = environment.apiUrl.replace(/\/api\/$/, '') || 'http://localhost:3005';
    this.socket = io(serverUrl, {
      transports: ['websocket'],
      autoConnect: true
    });
  }

  // Escuchar cualquier evento proveniente del Socket Server
  public onEvent<T>(eventName: string): Observable<T> {
    return new Observable<T>((observer) => {
      this.socket.on(eventName, (data: T) => {
        observer.next(data);
      });

      return () => {
        this.socket.off(eventName);
      };
    });
  }

  // Emitir un evento hacia el servidor
  public emitEvent(eventName: string, data: any): void {
    this.socket.emit(eventName, data);
  }
}
