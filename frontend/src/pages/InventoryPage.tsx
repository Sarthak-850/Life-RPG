import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.js';
import { useSound } from '../context/SoundContext.js';
import { useToast } from '../context/ToastContext.js';
import api from '../services/api.js';
import { InventoryItem, ItemType } from '../types/index.js';
import {
  Package,
  Sword,
  Shield,
  Crown,
  Sparkles,
  Check,
  Power,
  ShoppingBag,
} from 'lucide-react';
import EmptyState from '../components/common/EmptyState.js';
import { SkeletonCard } from '../components/common/Skeleton.js';

interface InventoryPageProps {
  onNavigate: (page: string) => void;
}

export const InventoryPage: React.FC<InventoryPageProps> = ({ onNavigate }) => {
  const { refreshCharacter } = useAuth();
  const { playClick } = useSound();
  const toast = useToast();

  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const items = await api.getInventory();
      setInventory(items);
    } catch (err: any) {
      toast.error(err.message || 'Failed to load inventory.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleToggleEquip = async (item: InventoryItem) => {
    playClick();
    setUpdatingId(item.id);

    try {
      if (item.isEquipped) {
        await api.unequipItem(item.id);
        toast.info(`Unequipped ${item.item.name}.`);
      } else {
        await api.equipItem(item.id);
        toast.success(`Equipped ${item.item.name}!`);
      }

      await Promise.all([fetchInventory(), refreshCharacter()]);
    } catch (err: any) {
      toast.error(err.message || 'Failed to update equipment.');
    } finally {
      setUpdatingId(null);
    }
  };

  const getIcon = (type: ItemType) => {
    switch (type) {
      case 'Weapon':
        return <Sword className="w-5 h-5" />;
      case 'Armor':
        return <Shield className="w-5 h-5" />;
      case 'Headwear':
        return <Crown className="w-5 h-5" />;
      case 'Aura':
        return <Sparkles className="w-5 h-5" />;
      default:
        return <Package className="w-5 h-5" />;
    }
  };

  const filters = ['All', 'Weapon', 'Armor', 'Headwear', 'Aura'];

  const filteredInventory = inventory.filter((inv) => {
    if (activeFilter !== 'All' && inv.item.type !== activeFilter) return false;
    return true;
  });

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest text-cyber-cyan font-cyber font-bold">
            Vault of Possessions
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold font-rpg text-white">
            Adventurer's Inventory
          </h1>
          <p className="text-xs text-text-secondary mt-0.5">
            Equip or unequip weapons, armor, headwear, and cosmetic auras.
          </p>
        </div>

        <button
          onClick={() => {
            playClick();
            onNavigate('shop');
          }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 hover:border-amber-500/60 text-slate-200 hover:text-white font-cyber font-bold text-xs uppercase tracking-wider transition-all"
        >
          <ShoppingBag className="w-4 h-4 text-cyber-amber" />
          <span>Visit Armory</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => {
              playClick();
              setActiveFilter(f);
            }}
            className={`px-4 py-2 rounded-xl border text-xs font-cyber font-bold transition-all ${
              activeFilter === f
                ? 'bg-purple-950/70 border-cyber-purple text-white shadow-glow-purple/30'
                : 'bg-citadel/60 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Inventory Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : filteredInventory.length === 0 ? (
        <EmptyState
          icon={Package}
          title="Your Vault is Empty"
          description="You haven't acquired any relics or gear yet. Earn gold through quests and visit the Armory."
          actionText="Visit Armory"
          onAction={() => onNavigate('shop')}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {filteredInventory.map((inv) => {
            const { item, isEquipped } = inv;

            return (
              <div
                key={inv.id}
                className={`rounded-2xl p-5 bg-citadel/70 border transition-all duration-300 flex flex-col justify-between relative overflow-hidden backdrop-blur-md ${
                  isEquipped
                    ? 'border-cyber-cyan shadow-glow-cyan/20 ring-1 ring-cyber-cyan/30'
                    : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[10px] uppercase font-cyber font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                      {item.rarity}
                    </span>
                    {isEquipped && (
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-cyan-950/60 border border-cyber-cyan text-cyber-cyan text-[10px] font-cyber font-bold">
                        <Check className="w-3 h-3" />
                        <span>Equipped</span>
                      </span>
                    )}
                  </div>

                  <div className="w-14 h-14 mx-auto rounded-2xl bg-black/40 border border-slate-800 flex items-center justify-center my-3 text-cyber-cyan">
                    {getIcon(item.type)}
                  </div>

                  <h3 className="text-base font-bold font-rpg text-center text-white">
                    {item.name}
                  </h3>
                  <p className="text-xs text-text-secondary mt-1 text-center line-clamp-2">
                    {item.description}
                  </p>

                  {item.statBonus && (
                    <div className="mt-3 py-1 px-2.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-cyber font-semibold text-cyber-cyan text-center">
                      ⚡ {item.statBonus}
                    </div>
                  )}
                </div>

                <div className="mt-5 pt-3 border-t border-slate-800">
                  <button
                    onClick={() => handleToggleEquip(inv)}
                    disabled={updatingId === inv.id}
                    className={`w-full py-2 rounded-xl font-cyber font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
                      isEquipped
                        ? 'bg-slate-800 text-slate-300 hover:bg-rose-950/40 hover:text-rose-300 hover:border-rose-500/40 border border-slate-700'
                        : 'bg-gradient-to-r from-cyber-purple to-cyber-cyan text-white shadow-glow-purple hover:brightness-110 active:scale-95'
                    }`}
                  >
                    <Power className="w-3.5 h-3.5" />
                    <span>
                      {updatingId === inv.id
                        ? 'Attuning...'
                        : isEquipped
                        ? 'Unequip'
                        : 'Equip Item'}
                    </span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default InventoryPage;
