import { getCharacterPreviewPath } from '../utils/animation/frameGeneration'

// Configuration for each character's variant count
const CHARACTER_VARIANTS = {
  CuteCat: 15,
  CutePenguin: 15,
  CuteBear: 15,
  CuteCapybara: 15,
  CuteDuck: 15,
  CuteMonster: 15,
  CutePanda: 15,
  CutePig: 15,
  CuteRacoon: 15,
} as const

// Automatically generate the CHARACTERS configuration
export const CHARACTERS = Object.entries(CHARACTER_VARIANTS).reduce((acc, [character, variantCount]) => {
  acc[character] = {
    variants: generateVariants(character, variantCount)
  }
  return acc
}, {} as Record<string, { variants: Record<string, { previewFrame: string }> }>)

// Function to generate variants object based on available files
function generateVariants(character: string, variantCount: number) {
  const variants: Record<string, { previewFrame: string }> = {}
  
  for (let i = 1; i <= variantCount; i++) {
    const variantKey = `Character${String(i).padStart(2, '0')}`
    variants[variantKey] = {
      previewFrame: getCharacterPreviewPath(character, variantKey)
    }
  }
  
  return variants
}

export type CharacterType = keyof typeof CHARACTERS
export type CharacterVariant<T extends CharacterType> = keyof typeof CHARACTERS[T]['variants']

export const validateCharacterSelection = (character: string, variant: string): boolean => {
  return (
    character in CHARACTERS &&
    variant in (CHARACTERS as any)[character].variants
  )
}