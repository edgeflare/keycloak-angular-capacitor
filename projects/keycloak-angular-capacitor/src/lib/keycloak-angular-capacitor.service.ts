import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, NgZone } from '@angular/core';
import Keycloak, { KeycloakLoginOptions, KeycloakProfile } from 'keycloak-js';
import { KEYCLOAK_CONFIG } from './keycloak.tokens';
import { BehaviorSubject, Observable, from, switchMap, tap } from 'rxjs';
import { Capacitor } from '@capacitor/core';
import { KeycloakCapacitorConfig } from './keycloak-config.interface';
import { Browser } from '@capacitor/browser';


@Injectable({
  providedIn: 'root'
})
export class KeycloakAngularCapacitorService {
  private readonly isIos: boolean;
  private readonly isAndroid: boolean;
  private readonly keycloakRedirectUri: string;

  private keycloak = new Keycloak();

  private userProfile: KeycloakProfile | null = null;
  public userProfile$ = new BehaviorSubject<KeycloakProfile | null>(this.userProfile);

  constructor(
    private http: HttpClient,
    private zone: NgZone,
    @Inject(KEYCLOAK_CONFIG) private config: KeycloakCapacitorConfig
  ) {
    // Initialize the keycloak instance with the config
    this.keycloak = new Keycloak({
      url: this.config.url,
      realm: this.config.realm,
      clientId: this.config.clientId,
    });

    this.isIos = Capacitor.isNativePlatform() && Capacitor.getPlatform() === 'ios';
    this.isAndroid = Capacitor.isNativePlatform() && Capacitor.getPlatform() === 'android';
    this.keycloakRedirectUri = this.isIos || this.isAndroid ? this.config.redirectUri : (this.config.redirectUriWeb || this.config.redirectUri);
  }

  get redirectUri(): string {
    const isNativePlatform = Capacitor.isNativePlatform();
    if (isNativePlatform && Capacitor.getPlatform() === 'ios') return this.config.redirectUri;
    if (isNativePlatform && Capacitor.getPlatform() === 'android') return this.config.redirectUri;
    return this.config.redirectUriWeb || this.config.redirectUri;
  }

  async init(): Promise<any> {
    return this.keycloak.init({
      adapter: 'default',
      onLoad: 'check-sso',
      redirectUri: this.redirectUri,
      checkLoginIframe: false
    });
  }

  async login(options?: KeycloakLoginOptions & { code?: string }): Promise<void> {
    this.zone.run(async () => {
      if (options?.code) {
        // If a code is provided, exchange it for tokens and load user profile
        this.exchangeCodeForToken(options.code).subscribe(async () => {
          await this.loadUserProfile();
          // In iOS explicitly close the browser after successful login
          if (Capacitor.isNativePlatform() && Capacitor.getPlatform() === 'ios') {
            await Browser.close();
          }
        });
      } else {
        // If no code is provided, open the login URL
        const url = this.keycloak.createLoginUrl(options);

        if (Capacitor.isNativePlatform()) {
          await Browser.open({ url });
        } else {
          window.location.href = url;
        }
      }
    });
  }

  exchangeCodeForToken(code: string): Observable<void> {
    const tokenEndpoint = `${this.config.url}/realms/${this.config.realm}/protocol/openid-connect/token`;
    const body = new URLSearchParams();
    body.set('grant_type', 'authorization_code');
    body.set('client_id', this.config.clientId);
    body.set('code', code);
    body.set('redirect_uri', this.keycloakRedirectUri);

    const headers = { 'Content-Type': 'application/x-www-form-urlencoded' };

    return this.http.post<any>(tokenEndpoint, body.toString(), { headers })
      .pipe(
        tap(res => {
          this.keycloak.token = res.access_token;
          this.keycloak.refreshToken = res.refresh_token;
          this.keycloak.idToken = res.id_token;
        }),
        switchMap(() => from(this.updateToken(70)))
      );
  }

  private updateToken(minValidity: number): Promise<void> {
    return this.keycloak.updateToken(minValidity)
      .then(refreshed => {
        if (refreshed) {
          console.log("Token was successfully refreshed");
        } else {
          console.log("Token is still valid");
        }
      })
      .catch(() => {
        console.error("Failed to refresh the token, or the session has expired");
      });
  }

  async loadUserProfile(): Promise<KeycloakProfile> {
    const userProfile = await this.keycloak.loadUserProfile();
    this.userProfile = userProfile;
    this.userProfile$.next(this.userProfile);
    return userProfile;
  }

  async logout(options?: KeycloakLoginOptions): Promise<void> {
    const url = this.keycloak.createLogoutUrl(options);

    if (Capacitor.isNativePlatform()) {
      await Browser.open({ url });
      // In iOS explicitly close the browser after successful logout
      if (Capacitor.isNativePlatform() && Capacitor.getPlatform() === 'ios') {
        await Browser.close();
      }
    } else {
      window.location.href = url;
    }

    this.userProfile = null;
    this.userProfile$.next(null);
  }

  get token(): string | undefined {
    return this.keycloak.token;
  }

}
