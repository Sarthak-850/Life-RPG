import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app.js';
import prisma from '../src/config/database.js';

const app = createApp();

describe('Life RPG Full-Stack API Integration Tests', () => {
  let userAToken: string;
  let userAId: string;
  let userBToken: string;
  let userBId: string;
  let questId: string;
  let itemId: string;

  beforeAll(async () => {
    // Clean up test data if present
    await prisma.user.deleteMany({
      where: {
        email: { in: ['hero_a@liferpg.dev', 'hero_b@liferpg.dev'] },
      },
    });
  });

  it('registers a new user and creates starting character and activity log', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'HeroAlpha',
        email: 'hero_a@liferpg.dev',
        password: 'Password123!',
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.username).toBe('HeroAlpha');
    expect(res.body.character.level).toBe(1);
    expect(res.body.character.gold).toBe(50);
    expect(res.body.character.strength).toBe(10);

    userAToken = res.body.token;
    userAId = res.body.user.id;
  });

  it('rejects duplicate email registration', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'HeroDifferent',
        email: 'hero_a@liferpg.dev',
        password: 'Password123!',
      });

    expect(res.status).toBe(409);
    expect(res.body.success).toBe(false);
  });

  it('logs in the user successfully and validates password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'hero_a@liferpg.dev',
        password: 'Password123!',
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
  });

  it('rejects login with invalid credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'hero_a@liferpg.dev',
        password: 'WrongPassword!',
      });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('registers a second user for authorization and isolation tests', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'HeroBeta',
        email: 'hero_b@liferpg.dev',
        password: 'Password123!',
      });

    expect(res.status).toBe(201);
    userBToken = res.body.token;
    userBId = res.body.user.id;
  });

  it('creates a new quest with authoritative reward calculation', async () => {
    const res = await request(app)
      .post('/api/quests')
      .set('Authorization', `Bearer ${userAToken}`)
      .send({
        title: 'Master TypeScript Generics',
        description: 'Deep dive into conditional and mapped types',
        category: 'Coding',
        difficulty: 'Medium',
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.quest.title).toBe('Master TypeScript Generics');
    expect(res.body.quest.xpReward).toBe(100);
    expect(res.body.quest.goldReward).toBe(40);
    expect(res.body.quest.attributeReward).toBe('Intellect');
    expect(res.body.quest.attributeAmount).toBe(4);

    questId = res.body.quest.id;
  });

  it('prevents User B from accessing or completing User A quest', async () => {
    // Attempt get
    const getRes = await request(app)
      .get(`/api/quests/${questId}`)
      .set('Authorization', `Bearer ${userBToken}`);
    expect(getRes.status).toBe(404);

    // Attempt complete
    const completeRes = await request(app)
      .post(`/api/quests/${questId}/complete`)
      .set('Authorization', `Bearer ${userBToken}`);
    expect(completeRes.status).toBe(404);
  });

  it('completes the quest and triggers XP, Gold, Level Up, and Activity Log', async () => {
    // User A completes the quest. Level 1 starts with 0 XP, requires 100 XP.
    // Quest gives 100 XP -> triggers level up to Level 2!
    const res = await request(app)
      .post(`/api/quests/${questId}/complete`)
      .set('Authorization', `Bearer ${userAToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.progression.leveledUp).toBe(true);
    expect(res.body.progression.newLevel).toBe(2);
    // 50 starting + 40 quest + 25 'FIRST_QUEST' achievement reward = 115
    expect(res.body.character.gold).toBe(115);
    expect(res.body.unlockedAchievements.length).toBeGreaterThanOrEqual(1);
    expect(res.body.character.intellect).toBe(14); // 10 starting + 4 intellect
    expect(res.body.character.currentStreak).toBe(1);
  });

  it('prevents completing the same quest a second time', async () => {
    const res = await request(app)
      .post(`/api/quests/${questId}/complete`)
      .set('Authorization', `Bearer ${userAToken}`);

    expect(res.status).toBe(400);
    expect(res.body.message).toContain('already been completed');
  });

  it('fetches shop items and purchases an item with gold check', async () => {
    const itemsRes = await request(app).get('/api/shop/items');
    expect(itemsRes.status).toBe(200);
    expect(itemsRes.body.items.length).toBeGreaterThan(0);

    const noviceBlade = itemsRes.body.items.find((i: any) => i.name === 'Novice Blade');
    expect(noviceBlade).toBeDefined();
    itemId = noviceBlade.id;

    // User A has 115 gold, Novice Blade costs 50 gold. Remaining: 65 gold.
    const buyRes = await request(app)
      .post(`/api/shop/items/${itemId}/purchase`)
      .set('Authorization', `Bearer ${userAToken}`);

    expect(buyRes.status).toBe(200);
    expect(buyRes.body.remainingGold).toBe(65);
  });

  it('rejects purchase when gold is insufficient', async () => {
    // User A has 40 gold left. Chrono Glaive costs 700 gold.
    const itemsRes = await request(app).get('/api/shop/items');
    const expensiveItem = itemsRes.body.items.find((i: any) => i.price > 100);

    const buyRes = await request(app)
      .post(`/api/shop/items/${expensiveItem.id}/purchase`)
      .set('Authorization', `Bearer ${userAToken}`);

    expect(buyRes.status).toBe(400);
    expect(buyRes.body.message).toContain('Insufficient gold');
  });

  it('verifies inventory and equips item', async () => {
    const invRes = await request(app)
      .get('/api/inventory')
      .set('Authorization', `Bearer ${userAToken}`);

    expect(invRes.status).toBe(200);
    expect(invRes.body.inventory.length).toBe(1);
    const inventoryId = invRes.body.inventory[0].id;

    // Equip item
    const equipRes = await request(app)
      .post(`/api/inventory/${inventoryId}/equip`)
      .set('Authorization', `Bearer ${userAToken}`);

    expect(equipRes.status).toBe(200);
    expect(equipRes.body.result.isEquipped).toBe(true);

    // Verify character profile reflects equipped weapon
    const charRes = await request(app)
      .get('/api/character')
      .set('Authorization', `Bearer ${userAToken}`);

    expect(charRes.status).toBe(200);
    expect(charRes.body.character.equippedItems.weapon.name).toBe('Novice Blade');
  });

  it('records chronological activity logs in database', async () => {
    const histRes = await request(app)
      .get('/api/history')
      .set('Authorization', `Bearer ${userAToken}`);

    expect(histRes.status).toBe(200);
    expect(histRes.body.logs.length).toBeGreaterThanOrEqual(3);
    const types = histRes.body.logs.map((l: any) => l.type);
    expect(types).toContain('QUEST_COMPLETE');
    expect(types).toContain('LEVEL_UP');
    expect(types).toContain('ITEM_PURCHASED');
  });

  it('returns healthy status on /api/health', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});
