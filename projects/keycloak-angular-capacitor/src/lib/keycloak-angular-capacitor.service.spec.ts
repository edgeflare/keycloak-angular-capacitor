import { TestBed } from '@angular/core/testing';

import { KeycloakAngularCapacitorService } from './keycloak-angular-capacitor.service';

describe('KeycloakAngularCapacitorService', () => {
  let service: KeycloakAngularCapacitorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KeycloakAngularCapacitorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
