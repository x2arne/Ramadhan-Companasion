// Service for sending Discord Webhook Notifications from Ramadan Companion

export interface DiscordEmbedField {
  name: string;
  value: string;
  inline?: boolean;
}

export interface DiscordEmbed {
  title: string;
  description: string;
  color?: number; // Integer color e.g. 0x8B5CF6 (violet)
  fields?: DiscordEmbedField[];
  footer?: {
    text: string;
    icon_url?: string;
  };
  thumbnail?: {
    url: string;
  };
  timestamp?: string;
}

export interface DiscordWebhookPayload {
  username?: string;
  avatar_url?: string;
  content?: string;
  embeds?: DiscordEmbed[];
}

export interface DiscordWebhookSettings {
  enabled: boolean;
  webhookUrl: string;
  notifyImsak: boolean;
  notifyMaghrib: boolean;
  notifyAllPrayers: boolean;
  notifyDailyReminder: boolean;
}

export const DISCORD_SETTINGS_KEY = 'ramadan_discord_webhook_settings_v1';

export const DEFAULT_DISCORD_SETTINGS: DiscordWebhookSettings = {
  enabled: false,
  webhookUrl: '',
  notifyImsak: true,
  notifyMaghrib: true,
  notifyAllPrayers: false,
  notifyDailyReminder: true,
};

export const getDiscordSettings = (): DiscordWebhookSettings => {
  try {
    const saved = localStorage.getItem(DISCORD_SETTINGS_KEY);
    return saved ? { ...DEFAULT_DISCORD_SETTINGS, ...JSON.parse(saved) } : DEFAULT_DISCORD_SETTINGS;
  } catch {
    return DEFAULT_DISCORD_SETTINGS;
  }
};

export const saveDiscordSettings = (settings: DiscordWebhookSettings): void => {
  try {
    localStorage.setItem(DISCORD_SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.warn('Failed to save Discord webhook settings', e);
  }
};

/**
 * Sends a payload to a Discord Webhook URL via cross-origin fetch
 */
export const sendDiscordWebhook = async (
  webhookUrl: string,
  payload: DiscordWebhookPayload
): Promise<{ success: boolean; error?: string }> => {
  if (!webhookUrl || !webhookUrl.startsWith('https://discord.com/api/webhooks/')) {
    return {
      success: false,
      error: 'URL Webhook Discord tidak valid. Harus diawali dengan https://discord.com/api/webhooks/...',
    };
  }

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: payload.username || 'Ramadan Companion',
        avatar_url: payload.avatar_url || 'https://ramadhan-site.vercel.app/crescent.svg',
        ...payload,
      }),
    });

    if (response.ok || response.status === 204) {
      return { success: true };
    }

    const errText = await response.text();
    return {
      success: false,
      error: `Discord merespons dengan status ${response.status}: ${errText.slice(0, 100)}`,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || 'Gagal menghubungi server Discord.',
    };
  }
};

/**
 * Sends an interactive test embed message to verify Discord Webhook
 */
export const sendTestDiscordWebhook = async (
  webhookUrl: string,
  cityName: string
): Promise<{ success: boolean; error?: string }> => {
  const testEmbed: DiscordEmbed = {
    title: 'Uji Coba Notifikasi Ramadan Companion',
    description: `Bot webhook berhasil terhubung ke channel Discord Anda!\n\nAplikasi **Ramadan Companion** siap mengirimkan pengingat waktu sholat, peringatan imsak, dan sirine berbuka puasa langsung ke server Discord ini.`,
    color: 0xe3b23a, // Violet
    thumbnail: {
      url: 'https://ramadhan-site.vercel.app/crescent.svg',
    },
    fields: [
      {
        name: 'Lokasi Terpantau',
        value: cityName,
        inline: true,
      },
      {
        name: 'Status Integrasi',
        value: 'Aktif & Terverifikasi',
        inline: true,
      },
      {
        name: 'Web App',
        value: '[ramadhan-site.vercel.app](https://ramadhan-site.vercel.app)',
        inline: false,
      },
    ],
    footer: {
      text: 'Ramadan Companion 1448 H • Pendamping Ibadah Terpercaya',
    },
    timestamp: new Date().toISOString(),
  };

  return sendDiscordWebhook(webhookUrl, {
    embeds: [testEmbed],
  });
};
