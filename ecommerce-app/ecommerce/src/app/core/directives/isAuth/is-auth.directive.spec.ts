import { IsAuthDirective } from './is-auth.directive';
import { Store } from '@ngrx/store';
import { TemplateRef, ViewContainerRef } from '@angular/core';

describe('IsAuthDirective', () => {

  let mockStore: jasmine.SpyObj<Store>;
  let mockViewContainer: jasmine.SpyObj<ViewContainerRef>;
  let mockTemplateRef: jasmine.SpyObj<TemplateRef<any>>;

  beforeEach(() => {
    mockStore = jasmine.createSpyObj('Store', ['select']);
    mockViewContainer = jasmine.createSpyObj('ViewContainerRef', ['clear', 'createEmbeddedView']);
    mockTemplateRef = jasmine.createSpyObj('TemplateRef', ['elementRef']);
  });

  it('should create an instance', () => {
    const directive = new IsAuthDirective(
      mockStore,
      mockViewContainer,
      mockTemplateRef
    );

    expect(directive).toBeTruthy();
  });

});
