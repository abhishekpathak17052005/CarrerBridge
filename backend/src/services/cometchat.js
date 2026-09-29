import { COMETCHAT_CONFIG } from '../config/cometchat.js';

export class CometChatService {
  /**
   * Helper to perform HTTP calls to CometChat REST API.
   */
  static async request(endpoint, options = {}) {
    if (!COMETCHAT_CONFIG.isConfigured()) {
      console.warn(`[CometChatService] Running in MOCK/FALLBACK mode for endpoint: ${endpoint} (Set COMETCHAT_APP_ID and COMETCHAT_API_KEY in backend/.env for live CometChat API calls)`);
      return { mock: true, success: true, endpoint };
    }

    const url = `${COMETCHAT_CONFIG.getBaseUrl()}${endpoint}`;
    const onBehalfOf = options.onBehalfOf || null;
    const headers = {
      ...COMETCHAT_CONFIG.getHeaders(onBehalfOf),
      ...(options.headers || {})
    };

    try {
      const res = await fetch(url, {
        method: options.method || 'GET',
        headers,
        body: options.body ? JSON.stringify(options.body) : undefined
      });

      const data = await res.json();
      if (!res.ok) {
        console.error(`[CometChatService Error] ${options.method || 'GET'} ${url}:`, data);
        throw new Error(data?.error?.message || `CometChat API error ${res.status}`);
      }
      return data;
    } catch (err) {
      console.error(`[CometChatService Exception] ${url}:`, err.message);
      throw err;
    }
  }

  /**
   * Provisions or registers a user in CometChat.
   */
  static async createUser({ uid, name, avatar, role = 'default', metadata = {} }) {
    if (!COMETCHAT_CONFIG.isConfigured()) {
      return { data: { uid, name, avatar, role, metadata, isMock: true } };
    }

    return await this.request('/users', {
      method: 'POST',
      body: { uid, name, avatar, role, metadata }
    });
  }

  /**
   * Issues an Auth Token for client-side login without exposing the API key.
   */
  static async createAuthToken(uid) {
    if (!COMETCHAT_CONFIG.isConfigured()) {
      return { data: { authToken: `mock_auth_token_${uid}_${Date.now()}`, uid } };
    }

    return await this.request(`/users/${uid}/auth_tokens`, {
      method: 'POST',
      body: { force: true }
    });
  }

  /**
   * Creates a private or public group (Career Room).
   */
  static async createGroup({ guid, name, type = 'private', description = '', icon = '' }) {
    if (!COMETCHAT_CONFIG.isConfigured()) {
      return { data: { guid, name, type, description, icon, isMock: true } };
    }

    return await this.request('/groups', {
      method: 'POST',
      body: { guid, name, type, description, icon }
    });
  }

  /**
   * Adds participants, moderators, and admins to a group.
   * Max 25 members per API call as per CometChat docs.
   */
  static async addGroupMembers(guid, { participants = [], moderators = [], admins = [] }) {
    if (!COMETCHAT_CONFIG.isConfigured()) {
      return { data: { guid, added: { participants, moderators, admins }, isMock: true } };
    }

    return await this.request(`/groups/${guid}/members`, {
      method: 'POST',
      body: { participants, moderators, admins }
    });
  }

  /**
   * Sends a standard text message. Can use onBehalfOf to post as CareerBridge AI.
   */
  static async sendTextMessage({ receiver, receiverType = 'group', text, onBehalfOf = null }) {
    if (!COMETCHAT_CONFIG.isConfigured()) {
      return {
        data: {
          id: `mock_msg_${Date.now()}`,
          receiver,
          receiverType,
          category: 'message',
          type: 'text',
          data: { text },
          sender: onBehalfOf || 'system',
          sentAt: Math.floor(Date.now() / 1000),
          isMock: true
        }
      };
    }

    return await this.request('/messages', {
      method: 'POST',
      onBehalfOf,
      body: {
        receiver,
        receiverType,
        category: 'message',
        type: 'text',
        data: { text }
      }
    });
  }

  /**
   * Sends a structured CustomMessage. Can use onBehalfOf to post as CareerBridge AI.
   */
  static async sendCustomMessage({ receiver, receiverType = 'group', subType = 'custom', customData = {}, onBehalfOf = null }) {
    if (!COMETCHAT_CONFIG.isConfigured()) {
      return {
        data: {
          id: `mock_custom_msg_${Date.now()}`,
          receiver,
          receiverType,
          category: 'custom',
          type: subType,
          data: { customData },
          sender: onBehalfOf || 'system',
          sentAt: Math.floor(Date.now() / 1000),
          isMock: true
        }
      };
    }

    return await this.request('/messages', {
      method: 'POST',
      onBehalfOf,
      body: {
        receiver,
        receiverType,
        category: 'custom',
        type: subType,
        data: {
          customData
        }
      }
    });
  }

  /**
   * Pre-provisions the CareerBridge AI bot user in CometChat.
   */
  static async provisionAiUser() {
    const aiUid = COMETCHAT_CONFIG.aiUid;
    return await this.createUser({
      uid: aiUid,
      name: 'CareerBridge AI',
      avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
      role: 'default',
      metadata: {
        isBot: true,
        type: 'ai_agent',
        description: 'Autonomous Placement Intervention Co-Pilot'
      }
    });
  }
}
