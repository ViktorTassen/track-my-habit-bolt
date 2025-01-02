import React, { useState, useEffect } from 'react';
import type { Character } from '../constants/characters';

interface AnimatedCharacterProps {
  character: Character;
  variantId: string;
  animation: string;
  className?: string;
}

export const AnimatedCharacter: React.FC<AnimatedCharacterProps> = ({
  character,
  variantId,
  animation,
  className = ''
}) => {
  const [currentFrame, setCurrentFrame] = useState(0);
  
  const variant = character.variants.find(v => v.id === variantId);
  if (!variant) throw new Error(`Variant ${variantId} not found for character ${character.id}`);
  
  const animationConfig = variant.animations[animation];
  if (!animationConfig) throw new Error(`Animation ${animation} not found for variant ${variantId}`);

  useEffect(() => {
    const frameInterval = 1000 / animationConfig.frameRate;
    
    const intervalId = setInterval(() => {
      setCurrentFrame(current => (current + 1) % animationConfig.frameCount);
    }, frameInterval);

    return () => clearInterval(intervalId);
  }, [animationConfig.frameCount, animationConfig.frameRate]);

  // Format frame number with leading zeros (00, 01, 02, etc.)
  const frameNumber = currentFrame.toString().padStart(2, '0');
  const imagePath = `/assets/characters/${character.id}/${variantId}/${animation}/${frameNumber}.png`;

  return (
    <img 
      src={imagePath}
      alt={`${character.name} ${animation}`}
      className={className}
    />
  );
};