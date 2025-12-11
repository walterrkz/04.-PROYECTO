import { Directive, TemplateRef, ViewContainerRef } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectIsAuthenticated } from '../../../store/auth/auth.selectors';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Directive({
  selector: '[appIsAuth]',
  standalone: true,
})
export class IsAuthDirective {
  private hasView = false;

  constructor(
    private store: Store,
    private viewContainer: ViewContainerRef,
    private templateRef: TemplateRef<any>
  ) {
    this.store
      .select(selectIsAuthenticated)
      .pipe(takeUntilDestroyed())
      .subscribe((isAuth) => {
        if (isAuth && !this.hasView) {
          this.viewContainer.createEmbeddedView(this.templateRef);
          this.hasView = true;
        } else if (!isAuth && this.hasView) {
          this.viewContainer.clear();
          this.hasView = false;
        }
      });
  }
}
