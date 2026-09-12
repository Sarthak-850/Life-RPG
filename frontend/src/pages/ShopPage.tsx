import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.js';
import { useSound } from '../context/SoundContext.js';
import { useToast } from '../context/ToastContext.js';
import api from '../services/api.js';
import { Item, ItemType, ItemRarity } from '../types/index.js';
import {
  Coins,
  Sword,
  Shield,
  Crown,
  Sparkles,
  Check,
  Package,
} from 'lucide-react';
import { SkeletonCard } from '../components/common/Skeleton.js';

interface ShopPageProps {
  onNavigate: (page: string) => void;
}

export const ShopPage: React.FC<ShopPageProps> = ({ onNavigate }) => {
  const { character, refreshCharacter } = useAuth();
  const { playClick, playPurchase, playError } = useSound();
  const toast = useToast();

  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [purchasingId, setPurchasingId] = useState<string | null>(null);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const fetched = await api.getShopItems();
      setItems(fetched);
    } catch (err: any) {
      toast.error(err.message || 'Failed to load armory.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handlePurchase = async (item: Item) => {
    playClick();

    if (item.isOwned) {
      toast.info('You already possess this item in your inventory.');
      return;
    }

    if (character && character.gold < item.price) {
      playError();
      toast.error(`Insufficient gold! You need ${item.price - character.gold} more Gold.`);
      return;
    }

    setPurchasingId(item.id);
    try {
      const res = await api.purchaseItem(item.id);
      playPurchase();
      toast.success(`Acquired ${item.name}! Added to your inventory.`);

      if (res.unlockedAchievements && res.unlockedAchievements.length > 0) {
        res.unlockedAchievements.forEach((ach) => toast.achievement(ach));
      }

      await Promise.all([fetchItems(), refreshCharacter()]);
    } catch (err: any) {
      playError();
      toast.error(err.message || 'Purchase failed.');
    } finally {
      setPurchasingId(null);
    }
  };

  const rarityStyles: Record<ItemRarity, { border: string; text: string; badge: string; shadow: string }> = {
    Common: {
      border: 'border-slate-700',
      text: 'text-slate-300',
      badge: 'bg-slate-800 text-slate-300',
      shadow: '',
    },
    Rare: {
      border: 'border-cyan-500/50',
      text: 'text-cyber-cyan',
      badge: 'bg-cyan-950/40 text-cyan-400 border border-cyan-500/30',
      shadow: 'shadow-glow-cyan/20',
    },
    Epic: {
      border: 'border-purple-500/50',
      text: 'text-cyber-purple',
      badge: 'bg-purple-950/40 text-purple-400 border border-purple-500/30',
      shadow: 'shadow-glow-purple/30',
    },
    Legendary: {
      border: 'border-amber-500/60',
      text: 'text-cyber-gold',
      badge: 'bg-amber-950/40 text-cyber-gold border border-amber-500/40',
      shadow: 'shadow-glow-gold/40',
    },
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

  const filteredItems = items.filter((item) => {
    if (activeFilter !== 'All' && item.type !== activeFilter) return false;
    return true;
  });

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header & Treasury */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest text-cyber-cyan font-cyber font-bold">
            The Grand Armory
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold font-rpg text-white">
            Cyber-Fantasy Emporium
          </h1>
          <p className="text-xs text-text-secondary mt-0.5">
            Exchange your hard-earned gold for weaponry, armor, and divine auras.
          </p>
        </div>

        {character && (
          <div className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/40 shadow-glow-gold/20">
            <Coins className="w-5 h-5 text-cyber-amber animate-pulse" />
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Your Purse</span>
              <span className="text-base font-bold font-cyber text-cyber-gold">
                {character.gold} <span className="text-xs font-normal">Gold</span>
              </span>
            </div>
          </div>
        )}
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

      {/* Items Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {filteredItems.map((item) => {
            const style = rarityStyles[item.rarity] || rarityStyles.Common;
            const canAfford = character ? character.gold >= item.price : false;

            return (
              <div
                key={item.id}
                className={`rounded-2xl p-5 bg-citadel/70 border ${style.border} ${style.shadow} backdrop-blur-md flex flex-col justify-between transition-all hover:scale-[1.02] relative group overflow-hidden`}
              >
                {/* Rarity & Type Badges */}
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-cyber font-bold uppercase ${style.badge}`}>
                      {item.rarity}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1 font-medium">
                      {getIcon(item.type)}
                      <span>{item.type}</span>
                    </span>
                  </div>

                  {/* Icon Card Centerpiece */}
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-black/40 border border-slate-800 flex items-center justify-center my-3 shadow-inner text-cyber-cyan group-hover:scale-110 transition-transform">
                    {getIcon(item.type)}
                  </div>

                  {/* Item Name & Description */}
                  <h3 className={`text-base font-bold font-rpg tracking-wide text-center ${style.text}`}>
                    {item.name}
                  </h3>
                  <p className="text-xs text-text-secondary mt-1 text-center line-clamp-2">
                    {item.description}
                  </p>

                  {/* Stat Bonus Tag */}
                  {item.statBonus && (
                    <div className="mt-3 py-1 px-2.5 rounded-lg bg-slate-900/80 border border-slate-800 text-[11px] font-cyber font-semibold text-cyber-cyan text-center">
                      ⚡ {item.statBonus}
                    </div>
                  )}
                </div>

                {/* Purchase Bar */}
                <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1 font-cyber font-bold text-cyber-gold text-sm">
                    <Coins className="w-4 h-4 text-cyber-amber" />
                    <span>{item.price}</span>
                  </div>

                  {item.isOwned ? (
                    <button
                      onClick={() => onNavigate('inventory')}
                      className="px-3.5 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 font-cyber font-semibold text-[11px] flex items-center gap-1 hover:text-white transition-all"
                    >
                      <Check className="w-3.5 h-3.5 text-cyber-emerald" />
                      <span>Owned</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handlePurchase(item)}
                      disabled={purchasingId === item.id || !canAfford}
                      className={`px-4 py-1.5 rounded-xl font-cyber font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-1 ${
                        canAfford
                          ? 'bg-gradient-to-r from-amber-600 to-amber-500 text-white shadow-glow-gold hover:brightness-110 active:scale-95'
                          : 'bg-slate-800 text-slate-500 border border-slate-700/60 cursor-not-allowed'
                      }`}
                    >
                      {purchasingId === item.id ? 'Forging...' : canAfford ? 'Buy' : 'Short'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ShopPage;
