import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { KEYCLOAK_CONFIG, KeycloakAngularCapacitorModule } from 'keycloak-angular-capacitor';
// replace with
// import { KEYCLOAK_CONFIG, KeycloakAngularCapacitorModule } from '@edgeflare/keycloak-angular-capacitor';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    KeycloakAngularCapacitorModule
  ],
  providers: [
    {
      provide: KEYCLOAK_CONFIG,
      useValue: {
        url: 'http://localhost:8080',
        realm: 'demo-realm',
        clientId: 'demo-client',
        redirectUri: 'customscheme://auth',
        redirectUriWeb: 'http://localhost:4200'
      }
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
