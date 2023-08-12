import { ModuleWithProviders, NgModule } from '@angular/core';
import { KeycloakAngularCapacitorComponent } from './keycloak-angular-capacitor.component';
import { HttpClientModule } from '@angular/common/http';
import { KeycloakCapacitorConfig } from './keycloak-config.interface';
import { KEYCLOAK_CONFIG } from './keycloak.tokens';


@NgModule({
  declarations: [
    KeycloakAngularCapacitorComponent
  ],
  imports: [
    HttpClientModule
  ],
  exports: [
    KeycloakAngularCapacitorComponent
  ]
})
export class KeycloakAngularCapacitorModule {
  static forRoot(config: KeycloakCapacitorConfig): ModuleWithProviders<KeycloakAngularCapacitorModule> {
    return {
      ngModule: KeycloakAngularCapacitorModule,
      providers: [
        {
          provide: KEYCLOAK_CONFIG,
          useValue: config
        }
      ]
    };
  }
}
