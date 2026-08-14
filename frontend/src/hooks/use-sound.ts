import { useCallback } from 'react';
import { playSound, SoundEffect } from '@/lib/sounds/sound';

export function useSound() {
  const play = useCallback((effect: SoundEffect) => {
    playSound(effect);
  }, []);

  return { playSound: play };
}
