# KeycloakAngularCapacitor

## About
> ### This is attempt to open Keycloak login page in mobile device's embedded (in-app) browser on [Angular](https://angular.io/) and [Capacitor](https://capacitorjs.com/) based native apps. If you reliably integrate Keycloak, please create PRs.

[Auth demo on YouTube](https://youtu.be/YLQTsziDJug)

![Auth demo](./docs/demo.gif?raw=true)

## Similar projects
- https://www.npmjs.com/package/keycloak-angular (doesn't work on mobile)
- https://github.com/manfredsteyer/angular-oauth2-oidc (no instructions for mobile)
- https://github.com/JohannesBauer97/keycloak-ionic-example (opens in device's default browser instead of in-app browser, causing sub-optimal user experience)

## Installation

```sh
npm install --save keycloak-js @edgeflare/keycloak-angular-capacitor @capacitor/app @capacitor/browser @capacitor/core
```

## Setup

Update `src/app/app.module.ts`

```ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { KEYCLOAK_CONFIG, KeycloakAngularCapacitorModule } from '@edgeflare/keycloak-angular-capacitor';

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
        clientId: 'demo-app-client',
        redirectUri: 'customscheme://auth', // custom url scheme as documented in https://capacitorjs.com/docs/apis/app
        redirectUriWeb: 'http://localhost:4200'
      }
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

> `customscheme://auth` needs to be added in Keycloak client's `Valid redirect URIs` and `Valid post logout redirect URIs`. `customscheme` can be any lowercase characters, usually your mobile app name.

Initialize Keycloak in `src/app/app.component.ts`

```ts
import { Component } from '@angular/core';
import { App } from '@capacitor/app';
import { KeycloakAngularCapacitorService } from '@edgeflare/keycloak-angular-capacitor';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(
    private kc: KeycloakAngularCapacitorService,
  ) {
    this.kc.init();

    App.addListener('appUrlOpen', (data) => {
      const params = new URLSearchParams(new URL(data.url).hash.substring(1));
      const code = params.get('code');

      if (code) {
        this.kc.login({ code }).then(() => {
          console.log("Login successful");
        }).catch(error => {
          console.error("Login failed", error);
        });
      }
    });
  }

  // Optional. Can be called in whichever component the KeycloakAngularCapacitorService is injected

  login() {
    this.kc.login();
  }

  logout() {
    this.kc.logout();
  }

  loadUserProfile() {
    return this.kc.loadUserProfile();
  }
}
```
