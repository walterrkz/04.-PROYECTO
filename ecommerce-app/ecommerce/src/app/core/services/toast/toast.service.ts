import { Injectable } from '@angular/core';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { ToastMessage } from '../../types/ToastMessage';

@Injectable({ providedIn: 'root' })
export class ToastService {
  private toastSubject = new BehaviorSubject<ToastMessage[]>([]);
  readonly toast$ = this.toastSubject.asObservable();

  private toastHistorySubject = new ReplaySubject<ToastMessage>(10);
  toastHistory$ = this.toastHistorySubject.asObservable();

  private counter = 0;

  private showHistorySubject = new BehaviorSubject<boolean>(false);
  showHistory$ = this.showHistorySubject.asObservable();

  toggleHistory() {
    this.showHistorySubject.next(!this.showHistorySubject.value);
  }

  setHistoryVisible(value: boolean) {
    this.showHistorySubject.next(value);
  }

  private show(toastPartial: Omit<ToastMessage, 'id'>) {
    const id = ++this.counter;
    const newToast: ToastMessage = { ...toastPartial, id };
    const currentToasts = this.toastSubject.value;

    this.toastSubject.next([...currentToasts, newToast]);
    this.toastHistorySubject.next(newToast);

    setTimeout(() => this.dismiss(id), toastPartial.duration ?? 5000);
  }

  private dismiss(id: number) {
    const update = this.toastSubject.value.filter((t) => t.id !== id);
    this.toastSubject.next(update);
  }

  success(text: string, duration = 5000) {
    this.show({ text, type: 'success', duration });
  }

  error(text: string, duration = 5000) {
    this.show({ text, type: 'error', duration });
  }
}
