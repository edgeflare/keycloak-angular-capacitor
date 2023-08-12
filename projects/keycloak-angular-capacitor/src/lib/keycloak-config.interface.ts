import { KeycloakConfig } from "keycloak-js";

export interface KeycloakCapacitorConfig extends KeycloakConfig {
  url: string;
  realm: string;
  clientId: string;
  redirectUri: string;
  redirectUriWeb?: string;
}