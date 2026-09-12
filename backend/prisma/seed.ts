import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const ITEMS = [
  // Weapons
  {
    name: 'Novice Blade',
    description: 'A forged steel blade given to every aspiring adventurer.',
    price: 50,
    rarity: 'Common',
    type: 'Weapon',
    icon: 'Sword',
    statBonus: '+2 Strength',
  },
  {
    name: 'Cyber Katana',
    description: 'An energized plasma-edged blade that hums with neon energy.',
    price: 150,
    rarity: 'Rare',
    type: 'Weapon',
    icon: 'Zap',
    statBonus: '+5 Agility',
  },
  {
    name: 'Void Reaver',
    description: 'A dark weapon infused with abyss matter that tears through inertia.',
    price: 350,
    rarity: 'Epic',
    type: 'Weapon',
    icon: 'Flame',
    statBonus: '+10 Strength',
  },
  {
    name: 'Chrono Glaive',
    description: 'A mythical polearm capable of slicing seconds out of reality.',
    price: 700,
    rarity: 'Legendary',
    type: 'Weapon',
    icon: 'Sparkles',
    statBonus: '+20 All Stats',
  },

  // Armor & Cloaks
  {
    name: 'Cloth Robe',
    description: 'Comfortable lightweight weave favored by novice scholars.',
    price: 40,
    rarity: 'Common',
    type: 'Armor',
    icon: 'Shield',
    statBonus: '+2 Wisdom',
  },
  {
    name: 'Shadow Cloak',
    description: 'Woven from stealth nano-fibers. Drastically heightens reflex.',
    price: 160,
    rarity: 'Rare',
    type: 'Armor',
    icon: 'Moon',
    statBonus: '+6 Agility',
  },
  {
    name: 'Obsidian Cuirass',
    description: 'Heavy tempered volcanic plating for unbroken resolve.',
    price: 380,
    rarity: 'Epic',
    type: 'Armor',
    icon: 'ShieldAlert',
    statBonus: '+12 Discipline',
  },
  {
    name: 'Aegis of the Cosmos',
    description: 'Celestial plate forged in the dying embers of a blue star.',
    price: 750,
    rarity: 'Legendary',
    type: 'Armor',
    icon: 'ShieldCheck',
    statBonus: '+25 Defense',
  },

  // Headwear
  {
    name: 'Iron Circlet',
    description: 'A simple metallic band that helps center wandering thoughts.',
    price: 45,
    rarity: 'Common',
    type: 'Headwear',
    icon: 'Circle',
    statBonus: '+2 Intellect',
  },
  {
    name: 'Neural Visor',
    description: 'Augmented cyber-optics that calculate optimal productivity routes.',
    price: 175,
    rarity: 'Rare',
    type: 'Headwear',
    icon: 'Eye',
    statBonus: '+8 Intellect',
  },
  {
    name: 'Crown of Solitude',
    description: 'A crest worn by legendary philosophers who mastered deep work.',
    price: 400,
    rarity: 'Epic',
    type: 'Headwear',
    icon: 'Crown',
    statBonus: '+15 Wisdom',
  },
  {
    name: 'Cyber Sovereign Helm',
    description: 'The supreme mantle of digital conquerors.',
    price: 800,
    rarity: 'Legendary',
    type: 'Headwear',
    icon: 'Crown',
    statBonus: '+25 All Stats',
  },

  // Auras & Relics
  {
    name: 'Spark Aura',
    description: 'Gentle motes of violet light swirl around your avatar.',
    price: 60,
    rarity: 'Common',
    type: 'Aura',
    icon: 'Sparkle',
    statBonus: '+2 Energy',
  },
  {
    name: 'Phoenix Flame Aura',
    description: 'Blazing embers of resilience that burn away procrastination.',
    price: 200,
    rarity: 'Rare',
    type: 'Aura',
    icon: 'Flame',
    statBonus: '+8 Discipline',
  },
  {
    name: 'Astral Halo',
    description: 'A rotating ring of luminous cosmic runes.',
    price: 450,
    rarity: 'Epic',
    type: 'Aura',
    icon: 'Sun',
    statBonus: '+16 Wisdom',
  },
  {
    name: 'Singularity Core',
    description: 'A miniature black hole artifact generating infinite momentum.',
    price: 900,
    rarity: 'Legendary',
    type: 'Aura',
    icon: 'Atom',
    statBonus: '+30 Ultimate Power',
  },
];

const ACHIEVEMENTS = [
  {
    key: 'FIRST_QUEST',
    name: 'First Blood',
    description: 'Complete your first quest and claim your destiny.',
    category: 'Quest',
    requirementValue: 1,
    xpReward: 50,
    goldReward: 25,
    icon: 'CheckCircle2',
  },
  {
    key: 'LEVEL_5',
    name: 'Apprentice of Destiny',
    description: 'Reach Character Level 5 through disciplined effort.',
    category: 'Level',
    requirementValue: 5,
    xpReward: 150,
    goldReward: 75,
    icon: 'Award',
  },
  {
    key: 'LEVEL_10',
    name: 'Ascendant Master',
    description: 'Reach Character Level 10. You are among the elite.',
    category: 'Level',
    requirementValue: 10,
    xpReward: 300,
    goldReward: 150,
    icon: 'Crown',
  },
  {
    key: 'WARRIOR_5',
    name: 'Iron Will',
    description: 'Complete 5 Fitness quests to forge an unbreakable body.',
    category: 'Quest',
    requirementValue: 5,
    xpReward: 100,
    goldReward: 50,
    icon: 'Dumbbell',
  },
  {
    key: 'SCHOLAR_5',
    name: 'Seeker of Truth',
    description: 'Complete 5 Study or Coding quests to sharpen your mind.',
    category: 'Quest',
    requirementValue: 5,
    xpReward: 100,
    goldReward: 50,
    icon: 'BookOpen',
  },
  {
    key: 'STREAK_3',
    name: 'Ignited',
    description: 'Maintain a 3-day consecutive activity streak.',
    category: 'Streak',
    requirementValue: 3,
    xpReward: 100,
    goldReward: 50,
    icon: 'Flame',
  },
  {
    key: 'STREAK_7',
    name: 'Unstoppable',
    description: 'Maintain a 7-day consecutive activity streak.',
    category: 'Streak',
    requirementValue: 7,
    xpReward: 250,
    goldReward: 125,
    icon: 'Zap',
  },
  {
    key: 'GOLD_200',
    name: 'Treasure Hunter',
    description: 'Amass at least 200 Gold in your treasury.',
    category: 'Economy',
    requirementValue: 200,
    xpReward: 100,
    goldReward: 50,
    icon: 'Coins',
  },
  {
    key: 'FIRST_PURCHASE',
    name: 'Armory Patron',
    description: 'Purchase your first item from the Shop.',
    category: 'Economy',
    requirementValue: 1,
    xpReward: 75,
    goldReward: 40,
    icon: 'ShoppingBag',
  },
  {
    key: 'QUESTS_10',
    name: 'Veteran Adventurer',
    description: 'Complete 10 total quests in your journal.',
    category: 'Quest',
    requirementValue: 10,
    xpReward: 150,
    goldReward: 80,
    icon: 'Trophy',
  },
];

async function main() {
  console.log('Seeding Life RPG database...');

  // Seed Items
  for (const item of ITEMS) {
    const existing = await prisma.item.findFirst({ where: { name: item.name } });
    if (!existing) {
      await prisma.item.create({ data: item });
    }
  }
  console.log(`✓ Seeded ${ITEMS.length} shop items.`);

  // Seed Achievements
  for (const ach of ACHIEVEMENTS) {
    await prisma.achievement.upsert({
      where: { key: ach.key },
      update: ach,
      create: ach,
    });
  }
  console.log(`✓ Seeded ${ACHIEVEMENTS.length} achievements.`);

  console.log('Database seeding complete!');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
