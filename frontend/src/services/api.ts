import {
  User,
  Character,
  Quest,
  Item,
  InventoryItem,
  Achievement,
  ActivityLog,
  QuestCompletionResponse,
} from '../types/index.js';

const API_BASE = '/api';

class ApiClient {
  private getToken(): string | null {
    return localStorage.getItem('life_rpg_token');
  }

  private setToken(token: string): void {
    localStorage.setItem('life_rpg_token', token);
  }

  public removeToken(): void {
    localStorage.removeItem('life_rpg_token');
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = this.getToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.message || `Request failed with status ${response.status}`);
    }

    return data as T;
  }

  // Auth Endpoints
  public async register(payload: { username: string; email: string; password: string }): Promise<{
    user: User;
    character: Character;
    token: string;
  }> {
    const data = await this.request<{ user: User; character: Character; token: string }>(
      '/auth/register',
      {
        method: 'POST',
        body: JSON.stringify(payload),
      }
    );
    this.setToken(data.token);
    return data;
  }

  public async login(payload: { email: string; password: string }): Promise<{
    user: User;
    character: Character;
    token: string;
  }> {
    const data = await this.request<{ user: User; character: Character; token: string }>(
      '/auth/login',
      {
        method: 'POST',
        body: JSON.stringify(payload),
      }
    );
    this.setToken(data.token);
    return data;
  }

  public async getMe(): Promise<{ user: User; character: Character }> {
    return this.request<{ user: User; character: Character }>('/auth/me');
  }

  public async logout(): Promise<void> {
    try {
      await this.request('/auth/logout', { method: 'POST' });
    } finally {
      this.removeToken();
    }
  }

  // Quests Endpoints
  public async getQuests(params?: { category?: string; difficulty?: string; isCompleted?: boolean }): Promise<Quest[]> {
    const query = new URLSearchParams();
    if (params?.category) query.append('category', params.category);
    if (params?.difficulty) query.append('difficulty', params.difficulty);
    if (params?.isCompleted !== undefined) query.append('isCompleted', String(params.isCompleted));

    const qs = query.toString() ? `?${query.toString()}` : '';
    const res = await this.request<{ quests: Quest[] }>(`/quests${qs}`);
    return res.quests;
  }

  public async createQuest(payload: {
    title: string;
    description?: string;
    category: string;
    difficulty: string;
  }): Promise<Quest> {
    const res = await this.request<{ quest: Quest }>('/quests', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return res.quest;
  }

  public async updateQuest(
    id: string,
    payload: { title?: string; description?: string; category?: string; difficulty?: string }
  ): Promise<Quest> {
    const res = await this.request<{ quest: Quest }>(`/quests/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
    return res.quest;
  }

  public async deleteQuest(id: string): Promise<void> {
    await this.request(`/quests/${id}`, { method: 'DELETE' });
  }

  public async completeQuest(id: string): Promise<QuestCompletionResponse> {
    return this.request<QuestCompletionResponse>(`/quests/${id}/complete`, {
      method: 'POST',
    });
  }

  // Character Endpoints
  public async getCharacter(): Promise<Character> {
    const res = await this.request<{ character: Character }>('/character');
    return res.character;
  }

  public async updateAppearance(avatarColor: string): Promise<Character> {
    const res = await this.request<{ character: Character }>('/character/appearance', {
      method: 'PUT',
      body: JSON.stringify({ avatarColor }),
    });
    return res.character;
  }

  // Shop & Armory Endpoints
  public async getShopItems(): Promise<Item[]> {
    const res = await this.request<{ items: Item[] }>('/shop/items');
    return res.items;
  }

  public async purchaseItem(itemId: string): Promise<{
    inventoryEntry: InventoryItem;
    remainingGold: number;
    unlockedAchievements: Achievement[];
  }> {
    return this.request(`/shop/items/${itemId}/purchase`, {
      method: 'POST',
    });
  }

  // Inventory Endpoints
  public async getInventory(): Promise<InventoryItem[]> {
    const res = await this.request<{ inventory: InventoryItem[] }>('/inventory');
    return res.inventory;
  }

  public async equipItem(inventoryId: string): Promise<{ item: Item; character: Character }> {
    const res = await this.request<{ result: { item: Item; character: Character } }>(
      `/inventory/${inventoryId}/equip`,
      { method: 'POST' }
    );
    return res.result;
  }

  public async unequipItem(inventoryId: string): Promise<{ item: Item; character: Character }> {
    const res = await this.request<{ result: { item: Item; character: Character } }>(
      `/inventory/${inventoryId}/unequip`,
      { method: 'POST' }
    );
    return res.result;
  }

  // Achievements
  public async getAchievements(): Promise<{ achievements: Achievement[]; unlockedCount: number }> {
    return this.request<{ achievements: Achievement[]; unlockedCount: number }>('/achievements');
  }

  // Activity History
  public async getHistory(page = 1, limit = 20, type?: string): Promise<{
    logs: ActivityLog[];
    total: number;
    totalPages: number;
    page: number;
  }> {
    const query = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (type) query.append('type', type);
    return this.request(`/history?${query.toString()}`);
  }
}

export const api = new ApiClient();
export default api;
