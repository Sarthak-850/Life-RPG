import { PrismaClient } from '@prisma/client';
import AchievementService from './achievementService.js';

export class ShopService {
  /**
   * Atomically purchases an item from the shop.
   */
  static async purchaseItem(prisma: PrismaClient, userId: string, itemId: string) {
    return await prisma.$transaction(async (tx) => {
      // 1. Verify item exists
      const item = await tx.item.findUnique({ where: { id: itemId } });
      if (!item) {
        throw new Error('Item not found');
      }

      // 2. Check if already owned
      const existingInventory = await tx.inventory.findUnique({
        where: {
          userId_itemId: {
            userId,
            itemId,
          },
        },
      });
      if (existingInventory) {
        throw new Error('You already own this item');
      }

      // 3. Verify user has enough gold
      const character = await tx.character.findUnique({ where: { userId } });
      if (!character) {
        throw new Error('Character not found');
      }
      if (character.gold < item.price) {
        throw new Error(`Insufficient gold. You have ${character.gold}g, but this item costs ${item.price}g.`);
      }

      // 4. Deduct gold
      const updatedCharacter = await tx.character.update({
        where: { userId },
        data: {
          gold: { decrement: item.price },
        },
      });

      // 5. Add to inventory
      const inventoryEntry = await tx.inventory.create({
        data: {
          userId,
          itemId,
          isEquipped: false,
        },
        include: { item: true },
      });

      // 6. Log activity
      await tx.activityLog.create({
        data: {
          userId,
          type: 'ITEM_PURCHASED',
          title: `Acquired: ${item.name}`,
          description: `Purchased ${item.rarity} ${item.type} for ${item.price} Gold.`,
          metadata: JSON.stringify({
            itemId: item.id,
            itemName: item.name,
            price: item.price,
            rarity: item.rarity,
          }),
        },
      });

      return {
        success: true,
        inventoryEntry,
        remainingGold: updatedCharacter.gold,
      };
    });
  }

  /**
   * Equips or unequips an inventory item.
   */
  static async toggleEquipItem(
    prisma: PrismaClient,
    userId: string,
    inventoryId: string,
    equip: boolean
  ) {
    return await prisma.$transaction(async (tx) => {
      const inventoryEntry = await tx.inventory.findUnique({
        where: { id: inventoryId },
        include: { item: true },
      });

      if (!inventoryEntry || inventoryEntry.userId !== userId) {
        throw new Error('Inventory item not found or unauthorized');
      }

      const itemType = inventoryEntry.item.type;

      if (equip) {
        // Unequip any currently equipped item of the same type for this user
        const equippedSameType = await tx.inventory.findMany({
          where: {
            userId,
            isEquipped: true,
            item: { type: itemType },
          },
        });

        for (const prev of equippedSameType) {
          await tx.inventory.update({
            where: { id: prev.id },
            data: { isEquipped: false },
          });
        }

        // Set this item as equipped
        const updated = await tx.inventory.update({
          where: { id: inventoryId },
          data: { isEquipped: true },
          include: { item: true },
        });

        // Update character equipped field
        const updateData: any = {};
        if (itemType === 'Weapon') updateData.equippedWeaponId = inventoryEntry.item.id;
        if (itemType === 'Armor') updateData.equippedArmorId = inventoryEntry.item.id;
        if (itemType === 'Headwear') updateData.equippedHeadId = inventoryEntry.item.id;
        if (itemType === 'Aura') updateData.equippedAuraId = inventoryEntry.item.id;

        const updatedChar = await tx.character.update({
          where: { userId },
          data: updateData,
        });

        await tx.activityLog.create({
          data: {
            userId,
            type: 'ITEM_EQUIPPED',
            title: `Equipped: ${inventoryEntry.item.name}`,
            description: `Now channeling the power of ${inventoryEntry.item.name}.`,
          },
        });

        return { success: true, isEquipped: true, item: updated.item, character: updatedChar };
      } else {
        // Unequip item
        const updated = await tx.inventory.update({
          where: { id: inventoryId },
          data: { isEquipped: false },
          include: { item: true },
        });

        const updateData: any = {};
        if (itemType === 'Weapon') updateData.equippedWeaponId = null;
        if (itemType === 'Armor') updateData.equippedArmorId = null;
        if (itemType === 'Headwear') updateData.equippedHeadId = null;
        if (itemType === 'Aura') updateData.equippedAuraId = null;

        const updatedChar = await tx.character.update({
          where: { userId },
          data: updateData,
        });

        return { success: true, isEquipped: false, item: updated.item, character: updatedChar };
      }
    });
  }
}

export default ShopService;
