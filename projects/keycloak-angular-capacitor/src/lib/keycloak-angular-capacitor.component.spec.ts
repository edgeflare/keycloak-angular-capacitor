import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KeycloakAngularCapacitorComponent } from './keycloak-angular-capacitor.component';

describe('KeycloakAngularCapacitorComponent', () => {
  let component: KeycloakAngularCapacitorComponent;
  let fixture: ComponentFixture<KeycloakAngularCapacitorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [KeycloakAngularCapacitorComponent]
    });
    fixture = TestBed.createComponent(KeycloakAngularCapacitorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
