import React, { createContext, useContext, useState } from 'react';
import audio from '../services/audioService.js';

interface SoundContextType {
  isMuted: boolean;
  toggleMute: () => void;
  playClick: () => void;
  playQuestComplete: () => void;
  playLevelUp: () => void;
  playPurchase: () => void;
  playError: () => void;
}

const SoundContext = createContext<SoundContextType | undefined>(undefined);

export const SoundProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMuted, setIsMuted] = useState<boolean>(audio.getMuted());

  const toggleMute = () => {
    const next = audio.toggleMute();
    setIsMuted(next);
  };

  const playClick = () => audio.playClick();
  const playQuestComplete = () => audio.playQuestComplete();
  const playLevelUp = () => audio.playLevelUp();
  const playPurchase = () => audio.playPurchase();
  const playError = () => audio.playError();

  return (
    <SoundContext.Provider
      value={{
        isMuted,
        toggleMute,
        playClick,
        playQuestComplete,
        playLevelUp,
        playPurchase,
        playError,
      }}
    >
      {children}
    </SoundContext.Provider>
  );
};

export const useSound = (): SoundContextType => {
  const context = useContext(SoundContext);
  if (!context) {
    throw new Error('useSound must be used within a SoundProvider');
  }
  return context;
};

export default SoundContext;
