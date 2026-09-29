import { ENV } from './env.js';

export const COMETCHAT_CONFIG = {
  appId: ENV.COMETCHAT.APP_ID,
  region: ENV.COMETCHAT.REGION,
  apiKey: ENV.COMETCHAT.API_KEY,
  authKey: ENV.COMETCHAT.AUTH_KEY,
  aiUid: ENV.COMETCHAT.AI_UID,
  officerUid: ENV.COMETCHAT.OFFICER_UID,
  getBaseUrl() {
    return `https://${this.appId}.api-${this.region.toLowerCase()}.cometchat.io/v3`;
  },
  getClientConfig() {
    return {
      appId: this.appId,
      region: this.region,
      authKey: this.authKey,
    };
  },
  getHeaders(onBehalfOf = null) {
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'apikey': this.apiKey,
      'appId': this.appId
    };
    if (onBehalfOf) {
      headers['onBehalfOf'] = onBehalfOf;
    }
    return headers;
  },
  isConfigured() {
    return Boolean(this.appId && this.apiKey);
  }
};
