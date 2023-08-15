import { Component } from '@angular/core';
import { App } from '@capacitor/app';
import { KeycloakAngularCapacitorService } from 'keycloak-angular-capacitor';
// replace with
// import { KeycloakAngularCapacitorService } from '@edgeflare/keycloak-angular-capacitor';

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

  login() {
    this.kc.login();
  }

  logout() {
    this.kc.logout();
  }

  loadUserProfile() {
    this.hasAttemptedToLoadProfile = true;
    return this.kc.loadUserProfile();
  }

  hasAttemptedToLoadProfile = false;
  userProfile$ = this.kc.userProfile$;
}
