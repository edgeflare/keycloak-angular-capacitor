import { InjectionToken } from '@angular/core';
import { KeycloakCapacitorConfig } from './keycloak-config.interface';

export const KEYCLOAK_CONFIG = new InjectionToken<KeycloakCapacitorConfig>('KEYCLOAK_CONFIG');
