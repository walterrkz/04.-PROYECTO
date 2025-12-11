import { Component, OnInit } from '@angular/core';
import { ToastService } from '../../../core/services/toast/toast.service';
import { Observable, of, scan } from 'rxjs';
import { ToastMessage } from '../../../core/types/ToastMessage';
import { AsyncPipe, NgClass } from '@angular/common';

@Component({
  selector: 'app-toast',
  imports: [AsyncPipe, NgClass],
  standalone: true,
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.css',
})
export class ToastComponent implements OnInit {
  toasts$: Observable<ToastMessage[]> = of([]);
  toastHistory$: Observable<ToastMessage[]> = of([]);
  showHistory$: Observable<boolean> = of(false);

  constructor(private toast: ToastService) {}

  ngOnInit(): void {
    this.toasts$ = this.toast.toast$;
    this.showHistory$ = this.toast.showHistory$;

    this.toastHistory$ = this.toast.toastHistory$.pipe(
      scan((acc: ToastMessage[], current: ToastMessage) => {
        const updated = [...acc, current];
        return updated.slice(-10);
      }, [])
    );
  }
}
