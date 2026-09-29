import { api } from './api.js';

let CometChatInstance = null;
let isInitialized = false;
let loggedInUser = null;

export const CometChatClient = {
  async init() {
    if (isInitialized) return true;

    try {
      const config = await api.getCometChatConfig();
      if (!config.isConfigured || !config.appId) {
        console.log('[CometChatClient] App ID not set. Operating in local real-time demo mode.');
        isInitialized = true;
        return false;
      }

      // Dynamically import to ensure bundling works cleanly
      const { CometChat } = await import('@cometchat/chat-sdk-javascript');
      CometChatInstance = CometChat;

      const appSetting = new CometChat.AppSettingsBuilder()
        .subscribePresenceForAllUsers()
        .setRegion(config.region)
        .autoEstablishSocketConnection(true)
        .build();

      await CometChat.init(config.appId, appSetting);
      isInitialized = true;
      console.log('[CometChatClient] CometChat SDK initialized successfully.');
      return true;
    } catch (err) {
      console.warn('[CometChatClient] Init note (falling back to local demo mode):', err.message);
      isInitialized = true;
      return false;
    }
  },

  async login(uid) {
    if (!CometChatInstance) {
      loggedInUser = { uid, name: uid, isDemo: true };
      return loggedInUser;
    }

    try {
      // Get auth token from our backend server
      const tokenRes = await api.getAuthToken(uid);
      if (tokenRes.authToken) {
        loggedInUser = await CometChatInstance.loginWithAuthToken(tokenRes.authToken);
        console.log(`[CometChatClient] Logged in with Auth Token as ${uid}`);
        return loggedInUser;
      }
    } catch (err) {
      console.warn(`[CometChatClient] loginWithAuthToken note: ${err.message}. Using demo session.`);
      loggedInUser = { uid, name: uid, isDemo: true };
      return loggedInUser;
    }
  },

  getLoggedInUser() {
    return loggedInUser;
  },

  getInstance() {
    return CometChatInstance;
  }
};
