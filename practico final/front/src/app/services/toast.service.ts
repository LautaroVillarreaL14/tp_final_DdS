import { Injectable, signal } from '@angular/core';

export type ToastMessage = { id: string; type: 'success' | 'error' | 'info'; text: string };

@Injectable({ providedIn: 'root' })
export class ToastService {
  messages = signal<ToastMessage[]>([]);

  private push(msg: ToastMessage) {
    this.messages.update((arr) => [...arr, msg]);
    setTimeout(() => this.remove(msg.id), 4000);
  }

  success(text: string) {
    this.push({ id: String(Date.now()) + Math.random().toString(36).slice(2), type: 'success', text });
  }

  error(text: string) {
    this.push({ id: String(Date.now()) + Math.random().toString(36).slice(2), type: 'error', text });
  }

  info(text: string) {
    this.push({ id: String(Date.now()) + Math.random().toString(36).slice(2), type: 'info', text });
  }

  remove(id: string) {
    this.messages.update((arr) => arr.filter((m) => m.id !== id));
  }
}
