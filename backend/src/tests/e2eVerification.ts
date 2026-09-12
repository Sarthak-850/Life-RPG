// Complete E2E Lifecycle Verification Script
const API_URL = 'http://localhost:5000/api';

async function runVerification() {
  console.log('🚀 Starting Comprehensive Life RPG Stabilization & Verification...\n');

  // Helper for JSON requests
  async function post(endpoint: string, body: any, token?: string): Promise<{ status: number; data: any }> {
    const res = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(body),
    });
    const data: any = await res.json();
    return { status: res.status, data };
  }

  async function get(endpoint: string, token?: string): Promise<{ status: number; data: any }> {
    const res = await fetch(`${API_URL}${endpoint}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    const data: any = await res.json();
    return { status: res.status, data };
  }

  async function put(endpoint: string, body: any, token?: string): Promise<{ status: number; data: any }> {
    const res = await fetch(`${API_URL}${endpoint}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(body),
    });
    const data: any = await res.json();
    return { status: res.status, data };
  }

  // 1. Health check
  console.log('1. Checking Backend Service Health...');
  const health = await get('/health');
  if (health.status !== 200 || health.data.status !== 'ok') {
    throw new Error('Health check failed: ' + JSON.stringify(health));
  }
  console.log('✓ Health check passed: Backend API is online.');

  // 2. Authentication: Register User A
  const testEmailA = `valkyrie_${Date.now()}@liferpg.dev`;
  console.log(`\n2. Registering User A (${testEmailA})...`);
  const regA = await post('/auth/register', {
    username: `Valkyrie_${Date.now().toString().slice(-4)}`,
    email: testEmailA,
    password: 'MasterPassword123!',
  });

  if (regA.status !== 201 || !regA.data.token) {
    throw new Error('User A registration failed: ' + JSON.stringify(regA));
  }
  const tokenA = regA.data.token;
  console.log(`✓ User A registered. Starting Character: Level ${regA.data.character.level}, Gold: ${regA.data.character.gold}g, XP: ${regA.data.character.xp}`);

  // 3. Register User B (for isolation checks)
  const testEmailB = `intruder_${Date.now()}@liferpg.dev`;
  console.log(`\n3. Registering User B (${testEmailB}) for isolation tests...`);
  const regB = await post('/auth/register', {
    username: `Intruder_${Date.now().toString().slice(-4)}`,
    email: testEmailB,
    password: 'IntruderPassword123!',
  });
  const tokenB = regB.data.token;
  console.log('✓ User B registered.');

  // 4. Quest CRUD - Create Quest for User A
  console.log('\n4. User A creating a new Quest ("Read Stoic Philosophy", Category: Reading, Difficulty: Medium)...');
  const questRes = await post(
    '/quests',
    {
      title: 'Read Stoic Philosophy for 60 Minutes',
      description: 'Meditations Book IV',
      category: 'Reading',
      difficulty: 'Medium',
    },
    tokenA
  );

  if (questRes.status !== 201) {
    throw new Error('Quest creation failed: ' + JSON.stringify(questRes));
  }
  const questId = questRes.data.quest.id;
  console.log(`✓ Quest created. Rewards calculated by backend: +${questRes.data.quest.xpReward} XP, +${questRes.data.quest.goldReward} Gold, +${questRes.data.quest.attributeAmount} ${questRes.data.quest.attributeReward}`);

  // 5. Quest CRUD - Read Quests
  console.log('\n5. Reading User A Quest List...');
  const listQuests = await get('/quests', tokenA);
  const found = listQuests.data.quests.find((q: any) => q.id === questId);
  if (!found) throw new Error('Created quest not found in list');
  console.log(`✓ Quest verified in database. Total active quests: ${listQuests.data.count}`);

  // 6. Quest CRUD - Update Quest
  console.log('\n6. Updating Quest Title...');
  const updateRes = await put(
    `/quests/${questId}`,
    {
      title: 'Read & Annotate Stoic Philosophy',
    },
    tokenA
  );
  if (updateRes.status !== 200 || updateRes.data.quest.title !== 'Read & Annotate Stoic Philosophy') {
    throw new Error('Quest update failed: ' + JSON.stringify(updateRes));
  }
  console.log('✓ Quest successfully updated.');

  // 7. Security Isolation Check: User B cannot access User A's quest
  console.log('\n7. Testing Security Isolation (User B attempting to access User A quest)...');
  const intruderGet = await get(`/quests/${questId}`, tokenB);
  if (intruderGet.status !== 404) {
    throw new Error(`Security breach: User B accessed User A quest with status ${intruderGet.status}`);
  }
  const intruderComplete = await post(`/quests/${questId}/complete`, {}, tokenB);
  if (intruderComplete.status !== 404) {
    throw new Error(`Security breach: User B completed User A quest with status ${intruderComplete.status}`);
  }
  console.log('✓ Security isolation verified: User B received 404 Not Found for both read & complete.');

  // 8. Quest Completion & RPG Progression (XP, Gold, Attributes, Streak, Level-Up)
  console.log('\n8. Completing Quest as User A...');
  const completeRes = await post(`/quests/${questId}/complete`, {}, tokenA);
  if (completeRes.status !== 200) {
    throw new Error('Quest completion failed: ' + JSON.stringify(completeRes));
  }
  const prog = completeRes.data.progression;
  const char = completeRes.data.character;
  console.log(`✓ Quest completed!`);
  console.log(`  - XP Earned: +${prog.xpEarned} XP`);
  console.log(`  - Gold Earned: +${prog.goldEarned} Gold`);
  console.log(`  - Attribute Boost: +${prog.attributeAmount} ${prog.attributeEarned}`);
  console.log(`  - Leveled Up: ${prog.leveledUp} (Level 1 -> Level ${prog.newLevel})`);
  console.log(`  - Streak Updated: ${prog.streak} day(s)`);
  console.log(`  - Character Purse: ${char.gold} Gold`);
  console.log(`  - Wisdom Stat: ${char.wisdom}`);

  if (!prog.leveledUp || prog.newLevel !== 2) {
    throw new Error('Level-up logic failed: Expected level 2, got ' + prog.newLevel);
  }

  // 9. Shop & Armory Purchase
  console.log('\n9. Browsing Armory and Purchasing Item...');
  const shopRes = await get('/shop/items', tokenA);
  const affordableItem = shopRes.data.items.find((i: any) => i.price <= char.gold);
  if (!affordableItem) throw new Error('No affordable item found in shop');

  console.log(`  Purchasing "${affordableItem.name}" for ${affordableItem.price} Gold...`);
  const buyRes = await post(`/shop/items/${affordableItem.id}/purchase`, {}, tokenA);
  if (buyRes.status !== 200) {
    throw new Error('Purchase failed: ' + JSON.stringify(buyRes));
  }
  const remainingGold = buyRes.data.remainingGold;
  const inventoryId = buyRes.data.inventoryEntry.id;
  console.log(`✓ Purchased successfully. Remaining Gold: ${remainingGold}g`);

  // 10. Inventory & Equip
  console.log('\n10. Equipping item in Inventory...');
  const equipRes = await post(`/inventory/${inventoryId}/equip`, {}, tokenA);
  if (equipRes.status !== 200 || !equipRes.data.result.isEquipped) {
    throw new Error('Equip failed: ' + JSON.stringify(equipRes));
  }
  console.log(`✓ "${affordableItem.name}" equipped to active character slot.`);

  // 11. Refresh Persistence Verification (Simulating browser refresh)
  console.log('\n11. Simulating Full Browser Refresh (verifying database persistence)...');
  const meRes = await get('/auth/me', tokenA);
  const refreshedChar = meRes.data.character;

  if (refreshedChar.level !== 2) {
    throw new Error(`Persistence failure: Level reverted to ${refreshedChar.level}`);
  }
  if (refreshedChar.gold !== remainingGold) {
    throw new Error(`Persistence failure: Gold mismatch (${refreshedChar.gold} vs ${remainingGold})`);
  }
  if (refreshedChar.wisdom !== char.wisdom) {
    throw new Error(`Persistence failure: Wisdom stat mismatch (${refreshedChar.wisdom} vs ${char.wisdom})`);
  }
  if (refreshedChar.currentStreak !== 1) {
    throw new Error(`Persistence failure: Streak mismatch (${refreshedChar.currentStreak})`);
  }
  console.log('✓ Character persistence verified: Level 2, Gold, Wisdom, Streak all preserved in database.');

  const invVerify = await get('/inventory', tokenA);
  const itemInVault = invVerify.data.inventory.find((i: any) => i.id === inventoryId);
  if (!itemInVault || !itemInVault.isEquipped) {
    throw new Error('Persistence failure: Equipped inventory item not preserved');
  }
  console.log('✓ Inventory persistence verified: Equipped item retained in database.');

  const histVerify = await get('/history', tokenA);
  if (histVerify.data.logs.length < 3) {
    throw new Error('Persistence failure: Activity logs missing');
  }
  console.log(`✓ Activity history verified: ${histVerify.data.logs.length} events persistently stored.`);

  // 12. Re-login Test
  console.log('\n12. Testing Logout and Re-Login...');
  await post('/auth/logout', {}, tokenA);
  const reLogin = await post('/auth/login', {
    email: testEmailA,
    password: 'MasterPassword123!',
  });
  if (reLogin.status !== 200 || reLogin.data.character.level !== 2) {
    throw new Error('Re-login failed or character data lost: ' + JSON.stringify(reLogin));
  }
  console.log('✓ Re-login successful: Full character session restored from database.');

  console.log('\n🎉 ALL 12 VERIFICATION PHASES PASSED WITH ZERO ERRORS!');
}

runVerification().catch((err) => {
  console.error('\n❌ VERIFICATION FAILED:', err);
  process.exit(1);
});
